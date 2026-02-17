const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Session store
const sessions = new Map();

class CanvasAPI {
  constructor(domain, auth) {
    this.domain = domain;
    this.baseUrl = `https://${domain}`;
    this.auth = auth; // { type: 'token' | 'session', value: string }
  }

  getHeaders() {
    if (this.auth.type === 'token') {
      return { 'Authorization': `Bearer ${this.auth.value}` };
    } else {
      // Session cookie auth
      return { 'Cookie': this.auth.value };
    }
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/api/v1${endpoint}`;

    try {
      const response = await axios({
        method: options.method || 'GET',
        url,
        headers: {
          ...this.getHeaders(),
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers
        },
        params: options.params,
        data: options.data,
        maxRedirects: 5
      });
      return { data: response.data, headers: response.headers };
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.response?.status, err.response?.data?.message || err.message);
      return { error: err.response?.status || 500, message: err.response?.data?.message || err.message };
    }
  }

  async paginate(endpoint, params = {}) {
    const results = [];
    let url = `${this.baseUrl}/api/v1${endpoint}`;
    params.per_page = 100;

    while (url) {
      try {
        const response = await axios({
          method: 'GET',
          url,
          headers: this.getHeaders(),
          params: url.includes('?') ? {} : params
        });

        if (Array.isArray(response.data)) {
          results.push(...response.data);
        } else {
          break;
        }

        const linkHeader = response.headers.link || '';
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        url = nextMatch ? nextMatch[1] : null;
        params = {};
      } catch (err) {
        console.error('Pagination error:', err.message);
        break;
      }
    }
    return results;
  }

  // GraphQL endpoint - sometimes less restricted
  async graphql(query, variables = {}) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/api/graphql`,
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        data: { query, variables }
      });
      return response.data;
    } catch (err) {
      return { errors: [{ message: err.message }] };
    }
  }

  async getCourses() {
    // Try GraphQL first
    const gqlResult = await this.graphql(`
      query {
        allCourses {
          id
          _id
          name
          courseCode
          syllabusBody
          term { name }
        }
      }
    `);

    if (gqlResult.data?.allCourses) {
      return gqlResult.data.allCourses.map(c => ({
        id: c._id,
        name: c.name,
        course_code: c.courseCode,
        syllabus_body: c.syllabusBody,
        term: { name: c.term?.name }
      }));
    }

    // Fallback to REST
    return this.paginate('/users/self/courses', {
      'include[]': ['syllabus_body', 'term', 'total_scores'],
      enrollment_state: 'active'
    });
  }

  async getCourse(courseId) {
    const { data } = await this.request(`/courses/${courseId}`, {
      params: { 'include[]': ['syllabus_body', 'term'] }
    });
    return data;
  }

  async getSyllabus(courseId) {
    const course = await this.getCourse(courseId);
    if (course?.error) return { error: course.error, hasContent: false };

    const html = course?.syllabus_body || '';
    const $ = cheerio.load(html || '<div></div>');

    return {
      courseId,
      courseName: course?.name,
      html,
      text: $.text().trim(),
      sections: this.extractSections($),
      hasContent: $.text().trim().length > 50
    };
  }

  async getRubrics(courseId) {
    const rubrics = await this.paginate(`/courses/${courseId}/rubrics`, {
      'include[]': ['assessments']
    });
    return Array.isArray(rubrics) ? rubrics.map(r => this.parseRubric(r)) : [];
  }

  async getAssignmentRubrics(courseId) {
    const assignments = await this.paginate(`/courses/${courseId}/assignments`, {
      'include[]': ['rubric']
    });

    if (!Array.isArray(assignments)) return [];

    return assignments
      .filter(a => a.rubric)
      .map(a => ({
        id: a.rubric_settings?.id || `assign_${a.id}`,
        title: a.rubric_settings?.title || `${a.name} Rubric`,
        assignmentId: a.id,
        assignmentName: a.name,
        pointsPossible: a.rubric_settings?.points_possible,
        criteria: a.rubric.map(c => ({
          id: c.id,
          description: c.description,
          longDescription: c.long_description,
          points: c.points,
          ratings: (c.ratings || []).map(r => ({
            description: r.description,
            points: r.points
          }))
        }))
      }));
  }

  async getGrades(courseId) {
    const { data } = await this.request(`/courses/${courseId}/enrollments`, {
      params: { user_id: 'self', 'include[]': ['grades'] }
    });
    return Array.isArray(data) ? data[0]?.grades : null;
  }

  parseRubric(rubric) {
    return {
      id: rubric.id,
      title: rubric.title,
      pointsPossible: rubric.points_possible,
      criteria: (rubric.data || []).map(c => ({
        id: c.id,
        description: c.description,
        longDescription: c.long_description,
        points: c.points,
        ratings: (c.ratings || []).map(r => ({
          description: r.description,
          points: r.points
        }))
      }))
    };
  }

  extractSections($) {
    const sections = [];
    $('h1, h2, h3, h4').each((_, el) => {
      const $el = $(el);
      let content = '';
      $el.nextUntil('h1, h2, h3, h4').each((_, sib) => {
        content += $(sib).text() + '\n';
      });
      if ($el.text().trim()) {
        sections.push({ title: $el.text().trim(), content: content.trim().slice(0, 500) });
      }
    });
    return sections;
  }
}

// ============ ROUTES ============

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth with session cookie (user copies from browser)
app.post('/auth/session', (req, res) => {
  const { domain, cookie } = req.body;
  if (!domain || !cookie) {
    return res.status(400).json({ error: 'domain and cookie required' });
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionId, {
    domain,
    auth: { type: 'session', value: cookie },
    created: Date.now()
  });

  res.json({ sessionId });
});

// Auth with access token
app.post('/auth/token', (req, res) => {
  const { domain, token } = req.body;
  if (!domain || !token) {
    return res.status(400).json({ error: 'domain and token required' });
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionId, {
    domain,
    auth: { type: 'token', value: token },
    created: Date.now()
  });

  res.json({ sessionId });
});

// Verify session works
app.get('/auth/verify', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const session = sessions.get(sessionId);
  if (!session) return res.status(401).json({ error: 'No session' });

  const api = new CanvasAPI(session.domain, session.auth);
  const { data, error } = await api.request('/users/self/profile');

  if (error) {
    return res.status(401).json({ error: 'Invalid session', details: error });
  }
  res.json({ valid: true, user: data });
});

// Auth middleware
const requireAuth = (req, res, next) => {
  const sessionId = req.headers['x-session-id'] || req.query.session;
  const session = sessions.get(sessionId);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  req.canvas = new CanvasAPI(session.domain, session.auth);
  req.session = session;
  next();
};

// ============ API ============

app.get('/api/courses', requireAuth, async (req, res) => {
  const courses = await req.canvas.getCourses();
  res.json(courses);
});

app.get('/api/courses/:id', requireAuth, async (req, res) => {
  const course = await req.canvas.getCourse(req.params.id);
  res.json(course);
});

app.get('/api/courses/:id/syllabus', requireAuth, async (req, res) => {
  const syllabus = await req.canvas.getSyllabus(req.params.id);
  res.json(syllabus);
});

app.get('/api/courses/:id/rubrics', requireAuth, async (req, res) => {
  let rubrics = await req.canvas.getRubrics(req.params.id);
  if (!rubrics.length) {
    rubrics = await req.canvas.getAssignmentRubrics(req.params.id);
  }
  res.json(rubrics);
});

app.get('/api/courses/:id/grades', requireAuth, async (req, res) => {
  const grades = await req.canvas.getGrades(req.params.id);
  res.json(grades);
});

app.get('/api/export', requireAuth, async (req, res) => {
  const courses = await req.canvas.getCourses();
  const result = { exportedAt: new Date().toISOString(), courses: [] };

  for (const course of courses) {
    const courseData = { id: course.id, name: course.name, syllabus: null, rubrics: [] };

    try { courseData.syllabus = await req.canvas.getSyllabus(course.id); } catch {}
    try {
      courseData.rubrics = await req.canvas.getRubrics(course.id);
      if (!courseData.rubrics.length) {
        courseData.rubrics = await req.canvas.getAssignmentRubrics(course.id);
      }
    } catch {}

    result.courses.push(courseData);
  }

  res.json(result);
});

// ============ INSTRUCTIONS PAGE ============

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Canvas Integration</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    pre { background: #1e1e1e; color: #fff; padding: 15px; border-radius: 8px; overflow-x: auto; }
    .step { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
    button { background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
    button:hover { background: #0052a3; }
    #result { margin-top: 20px; }
  </style>
</head>
<body>
  <h1>🎓 Canvas Integration</h1>

  <div class="step">
    <h3>Step 1: Get Your Session Cookie</h3>
    <ol>
      <li>Log into <a href="https://iu.instructure.com" target="_blank">Canvas</a> in this browser</li>
      <li>Open DevTools (F12 or Cmd+Opt+I)</li>
      <li>Go to <b>Application</b> → <b>Cookies</b> → <b>iu.instructure.com</b></li>
      <li>Find the cookie named <code>canvas_session</code></li>
      <li>Copy its <b>Value</b></li>
    </ol>
  </div>

  <div class="step">
    <h3>Step 2: Enter Your Cookie</h3>
    <input type="text" id="domain" value="iu.instructure.com" style="width: 300px; padding: 8px; margin-bottom: 10px;"><br>
    <textarea id="cookie" placeholder="Paste canvas_session cookie value here" style="width: 100%; height: 80px; padding: 8px;"></textarea><br><br>
    <button onclick="authenticate()">Connect</button>
  </div>

  <div id="result"></div>

  <div class="step">
    <h3>API Endpoints</h3>
    <pre>
GET /api/courses              - List all courses
GET /api/courses/:id/syllabus - Get syllabus
GET /api/courses/:id/rubrics  - Get rubrics
GET /api/export               - Export everything

Header: x-session-id: YOUR_SESSION_ID</pre>
  </div>

  <script>
    async function authenticate() {
      const domain = document.getElementById('domain').value;
      const cookie = document.getElementById('cookie').value;
      const result = document.getElementById('result');

      result.innerHTML = 'Connecting...';

      try {
        // Create session
        const authRes = await fetch('/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, cookie: 'canvas_session=' + cookie })
        });
        const { sessionId } = await authRes.json();

        // Verify it works
        const verifyRes = await fetch('/auth/verify', {
          headers: { 'x-session-id': sessionId }
        });
        const verify = await verifyRes.json();

        if (verify.valid) {
          result.innerHTML = '<h3>✅ Connected!</h3>' +
            '<p>User: ' + verify.user.name + '</p>' +
            '<p>Session ID: <code>' + sessionId + '</code></p>' +
            '<button onclick="loadCourses(\\'' + sessionId + '\\')">Load Courses</button>' +
            '<div id="courses"></div>';
        } else {
          result.innerHTML = '<h3>❌ Failed</h3><pre>' + JSON.stringify(verify, null, 2) + '</pre>';
        }
      } catch (err) {
        result.innerHTML = '<h3>❌ Error</h3><p>' + err.message + '</p>';
      }
    }

    async function loadCourses(sessionId) {
      const coursesDiv = document.getElementById('courses');
      coursesDiv.innerHTML = 'Loading...';

      const res = await fetch('/api/courses', {
        headers: { 'x-session-id': sessionId }
      });
      const courses = await res.json();

      coursesDiv.innerHTML = '<h4>Courses:</h4><ul>' +
        courses.map(c => '<li>' + c.name + ' (ID: ' + c.id + ')</li>').join('') +
        '</ul>';
    }
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Canvas API Server - http://localhost:${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auth Methods:
  POST /auth/session  { domain, cookie }
  POST /auth/token    { domain, token }

Open http://localhost:${PORT} for instructions
  `);
});

module.exports = app;
