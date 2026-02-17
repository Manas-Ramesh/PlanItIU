const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Store the Canvas session from extension
let canvasSession = null;

// ============ CANVAS API CLASS ============

class CanvasAPI {
  constructor(domain, cookie) {
    this.domain = domain;
    this.baseUrl = `https://${domain}`;
    this.cookie = cookie;
  }

  async request(endpoint, params = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    try {
      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Cookie': this.cookie,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        params
      });
      return response.data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.response?.status || err.message);
      return null;
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
          headers: {
            'Cookie': this.cookie,
            'Accept': 'application/json'
          },
          params: url.includes('?') ? {} : params
        });

        if (Array.isArray(response.data)) {
          results.push(...response.data);
        }

        const linkHeader = response.headers.link || '';
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        url = nextMatch ? nextMatch[1] : null;
        params = {};
      } catch {
        break;
      }
    }
    return results;
  }

  async getUser() {
    return this.request('/users/self/profile');
  }

  async getCourses() {
    return this.paginate('/users/self/courses', {
      'include[]': ['syllabus_body', 'term', 'total_scores'],
      enrollment_state: 'active'
    });
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`, { 'include[]': ['syllabus_body', 'term'] });
  }

  async getSyllabus(courseId) {
    const course = await this.getCourse(courseId);
    if (!course) return null;

    const html = course.syllabus_body || '';
    const $ = cheerio.load(html || '<div></div>');

    return {
      courseId,
      courseName: course.name,
      html,
      text: $.text().trim(),
      hasContent: $.text().trim().length > 50
    };
  }

  async getRubrics(courseId) {
    const rubrics = await this.paginate(`/courses/${courseId}/rubrics`, {
      'include[]': ['assessments']
    });

    if (rubrics?.length) {
      return rubrics.map(r => ({
        id: r.id,
        title: r.title,
        pointsPossible: r.points_possible,
        criteria: (r.data || []).map(c => ({
          description: c.description,
          points: c.points,
          ratings: (c.ratings || []).map(rt => ({
            description: rt.description,
            points: rt.points
          }))
        }))
      }));
    }

    // Try assignment rubrics
    const assignments = await this.paginate(`/courses/${courseId}/assignments`, {
      'include[]': ['rubric']
    });

    return (assignments || [])
      .filter(a => a.rubric)
      .map(a => ({
        id: `assign_${a.id}`,
        title: `${a.name} Rubric`,
        assignmentId: a.id,
        pointsPossible: a.rubric_settings?.points_possible,
        criteria: a.rubric.map(c => ({
          description: c.description,
          points: c.points,
          ratings: (c.ratings || []).map(r => ({
            description: r.description,
            points: r.points
          }))
        }))
      }));
  }

  async getAssignments(courseId) {
    return this.paginate(`/courses/${courseId}/assignments`, {
      'include[]': ['submission']
    });
  }

  async getFiles(courseId) {
    return this.paginate(`/courses/${courseId}/files`);
  }

  async getModules(courseId) {
    return this.paginate(`/courses/${courseId}/modules`, {
      'include[]': ['items']
    });
  }

  async getAnnouncements(courseId) {
    return this.request(`/courses/${courseId}/discussion_topics`, {
      only_announcements: true,
      per_page: 20
    });
  }

  async getGrades(courseId) {
    const enrollments = await this.request(`/courses/${courseId}/enrollments`, {
      user_id: 'self',
      'include[]': ['grades']
    });
    return enrollments?.[0]?.grades || null;
  }
}

// ============ ROUTES ============

// Health / status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connected: !!canvasSession,
    domain: canvasSession?.domain || null,
    user: canvasSession?.user?.name || null
  });
});

// Connect from extension (receives session)
app.post('/connect', async (req, res) => {
  const { domain, cookie } = req.body;

  if (!domain || !cookie) {
    return res.status(400).json({ error: 'domain and cookie required' });
  }

  const api = new CanvasAPI(domain, cookie);
  const user = await api.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Invalid session - could not fetch user' });
  }

  canvasSession = { domain, cookie, user, api, connectedAt: new Date() };

  console.log(`\n✅ Connected: ${user.name} (${user.primary_email || user.login_id})`);
  console.log(`   Domain: ${domain}\n`);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.primary_email || user.login_id,
      avatar: user.avatar_url
    }
  });
});

// Disconnect
app.post('/disconnect', (req, res) => {
  const wasConnected = !!canvasSession;
  canvasSession = null;
  res.json({ success: true, wasConnected });
});

// Get current user
app.get('/api/user', (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });
  res.json(canvasSession.user);
});

// Get all courses
app.get('/api/courses', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const courses = await canvasSession.api.getCourses();
  res.json(courses || []);
});

// Get single course
app.get('/api/courses/:id', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const course = await canvasSession.api.getCourse(req.params.id);
  res.json(course || { error: 'Not found' });
});

// Get syllabus
app.get('/api/courses/:id/syllabus', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const syllabus = await canvasSession.api.getSyllabus(req.params.id);
  res.json(syllabus || { error: 'Not found' });
});

// Get rubrics
app.get('/api/courses/:id/rubrics', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const rubrics = await canvasSession.api.getRubrics(req.params.id);
  res.json(rubrics || []);
});

// Get assignments
app.get('/api/courses/:id/assignments', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const assignments = await canvasSession.api.getAssignments(req.params.id);
  res.json(assignments || []);
});

// Get files/attachments
app.get('/api/courses/:id/files', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const files = await canvasSession.api.getFiles(req.params.id);
  res.json(files || []);
});

// Get modules
app.get('/api/courses/:id/modules', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const modules = await canvasSession.api.getModules(req.params.id);
  res.json(modules || []);
});

// Get announcements
app.get('/api/courses/:id/announcements', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const announcements = await canvasSession.api.getAnnouncements(req.params.id);
  res.json(announcements || []);
});

// Get grades
app.get('/api/courses/:id/grades', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const grades = await canvasSession.api.getGrades(req.params.id);
  res.json(grades || {});
});

// Bulk export - all data
app.get('/api/export', async (req, res) => {
  if (!canvasSession) return res.status(401).json({ error: 'Not connected' });

  const courses = await canvasSession.api.getCourses() || [];

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: canvasSession.user,
    domain: canvasSession.domain,
    courses: []
  };

  for (const course of courses) {
    const courseData = {
      id: course.id,
      name: course.name,
      code: course.course_code,
      syllabus: await canvasSession.api.getSyllabus(course.id),
      rubrics: await canvasSession.api.getRubrics(course.id),
      assignments: await canvasSession.api.getAssignments(course.id),
      files: await canvasSession.api.getFiles(course.id),
      grades: await canvasSession.api.getGrades(course.id)
    };
    exportData.courses.push(courseData);
  }

  res.json(exportData);
});

// ============ DEMO UI ============

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Canvas Integration Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { margin-bottom: 20px; color: #1a1a1a; }
    .status-bar { background: white; padding: 15px 20px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .status { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; }
    .status-dot.connected { background: #22c55e; }
    .status-dot.disconnected { background: #ef4444; }
    .user-info { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; }
    button { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-danger { background: #ef4444; color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h3 { margin-bottom: 15px; color: #1a1a1a; display: flex; align-items: center; gap: 8px; }
    .card-color { width: 4px; height: 24px; border-radius: 2px; }
    .course-meta { color: #666; font-size: 14px; margin-bottom: 10px; }
    .tabs { display: flex; gap: 5px; margin-bottom: 15px; flex-wrap: wrap; }
    .tab { padding: 6px 12px; border-radius: 6px; background: #f3f4f6; font-size: 13px; cursor: pointer; }
    .tab:hover { background: #e5e7eb; }
    .tab.active { background: #3b82f6; color: white; }
    .content { font-size: 14px; color: #374151; max-height: 300px; overflow-y: auto; }
    .content pre { background: #f8f9fa; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
    .syllabus-text { white-space: pre-wrap; line-height: 1.6; }
    .rubric { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; }
    .rubric-title { font-weight: 600; margin-bottom: 5px; }
    .criterion { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .criterion:last-child { border-bottom: none; }
    .file-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .empty { text-align: center; padding: 20px; color: #999; }
    .connect-prompt { text-align: center; padding: 60px 20px; }
    .connect-prompt h2 { margin-bottom: 10px; }
    .connect-prompt p { color: #666; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎓 Canvas Integration Demo</h1>

    <div class="status-bar">
      <div class="status">
        <div class="status-dot" id="status-dot"></div>
        <span id="status-text">Checking connection...</span>
      </div>
      <div class="user-info" id="user-info"></div>
    </div>

    <div id="content">
      <div class="loading">Loading...</div>
    </div>
  </div>

  <script>
    let courses = [];
    let currentData = {};

    async function checkStatus() {
      const res = await fetch('/health');
      const data = await res.json();

      const dot = document.getElementById('status-dot');
      const text = document.getElementById('status-text');
      const userInfo = document.getElementById('user-info');

      if (data.connected) {
        dot.className = 'status-dot connected';
        text.textContent = 'Connected to ' + data.domain;
        userInfo.innerHTML = '<span>' + data.user + '</span><button class="btn-danger" onclick="disconnect()">Disconnect</button>';
        loadCourses();
      } else {
        dot.className = 'status-dot disconnected';
        text.textContent = 'Not connected';
        userInfo.innerHTML = '';
        showConnectPrompt();
      }
    }

    function showConnectPrompt() {
      document.getElementById('content').innerHTML = \`
        <div class="connect-prompt">
          <h2>Connect Your Canvas Account</h2>
          <p>Use the Canvas Connect extension to link your account</p>
          <ol style="text-align:left;max-width:400px;margin:0 auto;color:#666;">
            <li>Install the Chrome extension from /extension folder</li>
            <li>Log into Canvas in your browser</li>
            <li>Click the extension → Enter your domain → Connect</li>
            <li>Refresh this page</li>
          </ol>
          <br>
          <button class="btn-primary" onclick="checkStatus()">Check Connection</button>
        </div>
      \`;
    }

    async function loadCourses() {
      document.getElementById('content').innerHTML = '<div class="loading">Loading courses...</div>';

      const res = await fetch('/api/courses');
      courses = await res.json();

      if (!courses.length) {
        document.getElementById('content').innerHTML = '<div class="empty">No courses found</div>';
        return;
      }

      renderCourses();
    }

    function renderCourses() {
      const colors = ['#e74c3c', '#3498db', '#9b59b6', '#2ecc71', '#f39c12', '#1abc9c'];

      document.getElementById('content').innerHTML = '<div class="grid">' +
        courses.map((c, i) => \`
          <div class="card" id="course-\${c.id}">
            <h3><div class="card-color" style="background:\${colors[i % colors.length]}"></div>\${c.name}</h3>
            <div class="course-meta">\${c.course_code || ''} · \${c.term?.name || ''}</div>
            <div class="tabs">
              <div class="tab active" onclick="loadTab(\${c.id}, 'syllabus', this)">Syllabus</div>
              <div class="tab" onclick="loadTab(\${c.id}, 'rubrics', this)">Rubrics</div>
              <div class="tab" onclick="loadTab(\${c.id}, 'assignments', this)">Assignments</div>
              <div class="tab" onclick="loadTab(\${c.id}, 'files', this)">Files</div>
            </div>
            <div class="content" id="content-\${c.id}">Click a tab to load data</div>
          </div>
        \`).join('') + '</div>';
    }

    async function loadTab(courseId, type, tabEl) {
      // Update active tab
      tabEl.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tabEl.classList.add('active');

      const contentEl = document.getElementById('content-' + courseId);
      contentEl.innerHTML = '<div class="loading">Loading...</div>';

      const res = await fetch('/api/courses/' + courseId + '/' + type);
      const data = await res.json();

      if (type === 'syllabus') {
        contentEl.innerHTML = data.hasContent
          ? '<div class="syllabus-text">' + (data.text || 'No content').substring(0, 2000) + '</div>'
          : '<div class="empty">No syllabus</div>';
      } else if (type === 'rubrics') {
        contentEl.innerHTML = data.length
          ? data.map(r => \`
              <div class="rubric">
                <div class="rubric-title">\${r.title} (\${r.pointsPossible || '?'} pts)</div>
                \${(r.criteria || []).map(c => \`
                  <div class="criterion">• \${c.description} - \${c.points} pts</div>
                \`).join('')}
              </div>
            \`).join('')
          : '<div class="empty">No rubrics</div>';
      } else if (type === 'assignments') {
        contentEl.innerHTML = data.length
          ? data.map(a => \`
              <div class="file-item">
                <span>\${a.name}</span>
                <span>\${a.due_at ? new Date(a.due_at).toLocaleDateString() : 'No due date'}</span>
              </div>
            \`).join('')
          : '<div class="empty">No assignments</div>';
      } else if (type === 'files') {
        contentEl.innerHTML = data.length
          ? data.map(f => \`
              <div class="file-item">
                <span>\${f.display_name || f.filename}</span>
                <span>\${(f.size / 1024).toFixed(1)} KB</span>
              </div>
            \`).join('')
          : '<div class="empty">No files</div>';
      }
    }

    async function disconnect() {
      await fetch('/disconnect', { method: 'POST' });
      checkStatus();
    }

    // Listen for extension connection
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'CANVAS_CONNECTED') {
        const { domain, cookie } = event.data;
        await fetch('/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, cookie })
        });
        checkStatus();
      }
    });

    checkStatus();
  </script>
</body>
</html>
  `);
});

// ============ START ============

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Canvas Demo Server - http://localhost:${PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Waiting for extension connection...

Connect via:
  1. Install extension from /extension folder
  2. Log into Canvas
  3. Click extension → Connect

Endpoints (after connected):
  GET /api/user                    - Current user
  GET /api/courses                 - All courses
  GET /api/courses/:id/syllabus    - Syllabus
  GET /api/courses/:id/rubrics     - Rubrics
  GET /api/courses/:id/assignments - Assignments
  GET /api/courses/:id/files       - Attachments
  GET /api/export                  - Full export
  `);
});

module.exports = app;
