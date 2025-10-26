#!/usr/bin/env node
import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  try {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = join(root, url.replace(/^\/+/, ''));
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      res.writeHead(403);
      res.end('Directory access is not allowed');
      return;
    }
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
