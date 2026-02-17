# Canvas LMS Integration

**Status:** Working ✅
**Auth Method:** Session cookie (bypasses API restrictions)

## Quick Start

```bash
npm install
npm start
# Open http://localhost:3001
```

## How It Works

IU (and many universities) lock down the Canvas API. This integration bypasses that by using **session cookie authentication** - the same auth method Canvas's own web UI uses.

1. User logs into Canvas normally
2. User copies their `canvas_session` cookie from browser DevTools
3. Our server uses that cookie to make API requests
4. Full access to courses, syllabi, rubrics, grades

## API Endpoints

```
POST /auth/session          - Auth with cookie
     { domain, cookie }

POST /auth/token            - Auth with API token (if available)
     { domain, token }

GET  /auth/verify           - Verify session works

GET  /api/courses           - List all courses
GET  /api/courses/:id       - Course details
GET  /api/courses/:id/syllabus  - Get syllabus (HTML + text)
GET  /api/courses/:id/rubrics   - Get rubrics with criteria
GET  /api/courses/:id/grades    - Get grades
GET  /api/export            - Bulk export all data

Headers: x-session-id: <session_id>
```

## React Integration

```javascript
// After user provides their session cookie
const res = await fetch('http://localhost:3001/auth/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'iu.instructure.com',
    cookie: 'canvas_session=' + userCookieValue
  })
});
const { sessionId } = await res.json();

// Now fetch data
const courses = await fetch('http://localhost:3001/api/courses', {
  headers: { 'x-session-id': sessionId }
}).then(r => r.json());
```

## Files

```
server.js          - Express API server (main file)
index.js           - Puppeteer scraper (standalone CLI)
canvas_browser.py  - Python alternative
```

## Session Cookie Expiry

Canvas session cookies typically last ~24 hours. Users will need to re-authenticate periodically.

## Production Notes

- Replace in-memory session store with Redis
- Add rate limiting
- Consider browser extension for seamless cookie extraction
- Session cookies are sensitive - use HTTPS in production
