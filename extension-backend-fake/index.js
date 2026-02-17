const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

class CanvasScraper {
  constructor(domain) {
    this.domain = domain;
    this.baseUrl = `https://${domain}`;
    this.browser = null;
    this.page = null;
    this.cookies = null;
    this.csrfToken = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
  }

  async login() {
    console.log(`\n🌐 Opening Canvas: ${this.baseUrl}`);
    console.log('📝 Log in with your credentials...\n');

    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });

    // Wait for login - user lands on dashboard or courses after auth
    await this.page.waitForFunction(
      () => window.location.href.includes('/courses') ||
            window.location.href.includes('/dashboard') ||
            window.location.href.includes('?login_success') ||
            document.querySelector('#dashboard') !== null,
      { timeout: 300000 }
    );

    console.log('✅ Login detected!\n');

    // Grab cookies and CSRF token
    this.cookies = await this.page.cookies();

    // Get CSRF token from page
    this.csrfToken = await this.page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute('content') : null;
    });

    // Also grab from ENV if available (Canvas stores it there too)
    if (!this.csrfToken) {
      this.csrfToken = await this.page.evaluate(() => {
        return window.ENV?.CSRF_TOKEN || null;
      });
    }

    return true;
  }

  // Make authenticated request using session cookies
  async apiRequest(endpoint, method = 'GET', data = null) {
    const cookieString = this.cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const headers = {
      'Cookie': cookieString,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const response = await axios({
        method,
        url,
        headers,
        data,
        maxRedirects: 5
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return { error: err.response.status, message: err.response.statusText };
      }
      throw err;
    }
  }

  // Internal API - gets courses with more data than public API
  async getCourses() {
    console.log('📚 Fetching courses...');

    // Use internal dashboard endpoint
    const data = await this.apiRequest('/api/v1/users/self/courses?include[]=syllabus_body&include[]=term&include[]=total_scores&per_page=100');

    if (Array.isArray(data)) {
      console.log(`   Found ${data.length} courses`);
      return data;
    }

    // Fallback: scrape from page
    await this.page.goto(`${this.baseUrl}/courses`, { waitUntil: 'networkidle2' });
    const html = await this.page.content();
    const $ = cheerio.load(html);

    const courses = [];
    $('a[href*="/courses/"]').each((_, el) => {
      const href = $(el).attr('href');
      const match = href.match(/\/courses\/(\d+)/);
      if (match) {
        courses.push({
          id: parseInt(match[1]),
          name: $(el).text().trim()
        });
      }
    });

    // Dedupe
    const seen = new Set();
    return courses.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return c.name.length > 2;
    });
  }

  // Get syllabus - uses internal API with session
  async getSyllabus(courseId) {
    // Try API first
    const course = await this.apiRequest(`/api/v1/courses/${courseId}?include[]=syllabus_body`);

    if (course.syllabus_body) {
      const $ = cheerio.load(course.syllabus_body);
      return {
        courseId,
        courseName: course.name,
        html: course.syllabus_body,
        text: $.text().trim(),
        hasContent: $.text().trim().length > 50
      };
    }

    // Fallback: scrape page
    await this.page.goto(`${this.baseUrl}/courses/${courseId}/assignments/syllabus`, { waitUntil: 'networkidle2' });

    const html = await this.page.$eval('#course_syllabus, .syllabus_content', el => el.innerHTML).catch(() => '');
    const $ = cheerio.load(html || '<div></div>');

    return {
      courseId,
      html,
      text: $.text().trim(),
      hasContent: $.text().trim().length > 50
    };
  }

  // Get rubrics - internal endpoint
  async getRubrics(courseId) {
    const rubrics = await this.apiRequest(`/api/v1/courses/${courseId}/rubrics?include[]=assessments&per_page=100`);

    if (Array.isArray(rubrics) && rubrics.length > 0) {
      return rubrics.map(r => this.parseRubric(r));
    }

    // Try getting from assignments
    return this.getAssignmentRubrics(courseId);
  }

  // Get rubrics attached to assignments
  async getAssignmentRubrics(courseId) {
    const assignments = await this.apiRequest(`/api/v1/courses/${courseId}/assignments?include[]=rubric&per_page=100`);

    const rubrics = [];
    if (Array.isArray(assignments)) {
      for (const assignment of assignments) {
        if (assignment.rubric) {
          rubrics.push({
            id: assignment.rubric_settings?.id || `assignment_${assignment.id}`,
            title: assignment.rubric_settings?.title || `${assignment.name} Rubric`,
            assignmentId: assignment.id,
            assignmentName: assignment.name,
            pointsPossible: assignment.rubric_settings?.points_possible,
            criteria: assignment.rubric.map(c => ({
              id: c.id,
              description: c.description,
              longDescription: c.long_description,
              points: c.points,
              ratings: (c.ratings || []).map(r => ({
                description: r.description,
                points: r.points
              }))
            }))
          });
        }
      }
    }
    return rubrics;
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
          longDescription: r.long_description,
          points: r.points
        }))
      }))
    };
  }

  // Get modules with items
  async getModules(courseId) {
    return this.apiRequest(`/api/v1/courses/${courseId}/modules?include[]=items&per_page=100`);
  }

  // Get announcements
  async getAnnouncements(courseId) {
    return this.apiRequest(`/api/v1/courses/${courseId}/discussion_topics?only_announcements=true&per_page=50`);
  }

  // Get assignments
  async getAssignments(courseId) {
    return this.apiRequest(`/api/v1/courses/${courseId}/assignments?include[]=submission&per_page=100`);
  }

  // Get grades
  async getGrades(courseId) {
    const enrollments = await this.apiRequest(`/api/v1/courses/${courseId}/enrollments?user_id=self&include[]=grades`);
    if (Array.isArray(enrollments) && enrollments.length > 0) {
      return enrollments[0].grades;
    }
    return null;
  }

  // Download file
  async downloadFile(fileUrl, savePath) {
    const cookieString = this.cookies.map(c => `${c.name}=${c.value}`).join('; ');

    const response = await axios({
      method: 'GET',
      url: fileUrl,
      headers: { 'Cookie': cookieString },
      responseType: 'arraybuffer'
    });

    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(savePath, response.data);
    return savePath;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const domain = process.argv[2] || 'iu.instructure.com';
  const courseFilter = process.argv[3]; // Optional specific course ID

  console.log('━'.repeat(50));
  console.log('Canvas Scraper - Session Auth');
  console.log('━'.repeat(50));

  const scraper = new CanvasScraper(domain);

  try {
    await scraper.init();
    await scraper.login();

    const courses = await scraper.getCourses();

    if (!courses.length) {
      console.log('No courses found');
      return;
    }

    const targetCourses = courseFilter
      ? courses.filter(c => c.id == courseFilter)
      : courses;

    const output = {
      exportedAt: new Date().toISOString(),
      domain,
      courses: []
    };

    for (const course of targetCourses) {
      console.log(`\n${'─'.repeat(40)}`);
      console.log(`📖 ${course.name || course.id}`);

      const courseData = {
        id: course.id,
        name: course.name,
        syllabus: null,
        rubrics: [],
        grades: null
      };

      // Syllabus
      console.log('   → Syllabus...');
      try {
        const syllabus = await scraper.getSyllabus(course.id);
        if (syllabus.hasContent) {
          courseData.syllabus = syllabus;
          console.log(`      ✓ ${syllabus.text.length} chars`);
        } else {
          console.log('      ✗ Empty');
        }
      } catch (e) {
        console.log(`      ✗ ${e.message}`);
      }

      // Rubrics
      console.log('   → Rubrics...');
      try {
        const rubrics = await scraper.getRubrics(course.id);
        if (rubrics.length) {
          courseData.rubrics = rubrics;
          console.log(`      ✓ ${rubrics.length} found`);
        } else {
          console.log('      ✗ None');
        }
      } catch (e) {
        console.log(`      ✗ ${e.message}`);
      }

      // Grades
      console.log('   → Grades...');
      try {
        const grades = await scraper.getGrades(course.id);
        if (grades) {
          courseData.grades = grades;
          console.log(`      ✓ ${grades.current_score || 'N/A'}%`);
        }
      } catch (e) {
        console.log(`      ✗ ${e.message}`);
      }

      output.courses.push(courseData);
    }

    // Save output
    const outDir = path.join(__dirname, 'downloads');
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, `canvas_${Date.now()}.json`);
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));

    console.log(`\n${'━'.repeat(50)}`);
    console.log(`✅ Saved: ${outFile}`);
    console.log('━'.repeat(50));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await scraper.close();
  }
}

// Export for use as module
module.exports = { CanvasScraper };

// Run if called directly
if (require.main === module) {
  main();
}
