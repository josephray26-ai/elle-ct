// Minimal static server. The app uses ES modules, so it has to be served over
// http:// rather than opened as a file://.  Run:  node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  // Mirrors GitHub Pages: index.html is the landing page, app.html is the app.
  // /app is kept as a local convenience alias only.
  const ROUTES = { '/': 'index.html', '/app': 'app.html', '/app/': 'app.html' };
  let file = path.join(ROOT, ROUTES[urlPath] || urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',   // so edits show up on refresh
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`ElleCT → http://localhost:${PORT}`));
