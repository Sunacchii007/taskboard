// A tiny HTTP app with zero dependencies (only Node's built-in modules),
// so `npm ci` is fast and nothing can break during install.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createStore } = require('./tasks');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function serveStatic(req, res) {
  const file = req.url === '/' ? 'index.html' : req.url.slice(1);
  const fullPath = path.join(PUBLIC_DIR, path.normalize(file));
  if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath)) {
    return sendJson(res, 404, { error: 'not found' });
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(fullPath)] || 'text/plain' });
  fs.createReadStream(fullPath).pipe(res);
}

function createApp() {
  const store = createStore();

  return http.createServer(async (req, res) => {
    // Health check: used later by staging smoke tests and monitoring.
    if (req.method === 'GET' && req.url === '/health') {
      return sendJson(res, 200, { status: 'ok', version: process.env.APP_VERSION || 'dev' });
    }

    if (req.method === 'GET' && req.url === '/api/tasks') {
      return sendJson(res, 200, store.list());
    }

    if (req.method === 'POST' && req.url === '/api/tasks') {
      const body = await readJson(req);
      try {
        return sendJson(res, 201, store.add(body.title));
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }

    const done = req.url.match(/^\/api\/tasks\/(\d+)\/done$/);
    if (req.method === 'PATCH' && done) {
      const task = store.complete(Number(done[1]));
      return task ? sendJson(res, 200, task) : sendJson(res, 404, { error: 'task not found' });
    }

    if (req.method === 'GET') return serveStatic(req, res);
    return sendJson(res, 404, { error: 'not found' });
  });
}

module.exports = { createApp };
