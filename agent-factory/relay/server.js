#!/usr/bin/env node
'use strict';
/*
 * Relais local : reçoit les événements des hooks (POST /event) et les diffuse à la page (SSE /events).
 * Il sert aussi la page (index.html) sur http://127.0.0.1:PORT, ce qui évite tout souci de navigateur.
 * Aucune dépendance. N'écoute que sur 127.0.0.1.
 *
 * Variables : PORT (défaut 4317) · ALLOW_ORIGIN (origines autorisées à lire le flux, séparées par des virgules,
 * ex. https://monsite.fr — utile seulement si la page est hébergée ailleurs).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 4317;
const HOST = '127.0.0.1';
const SELF = ['http://127.0.0.1:' + PORT, 'http://localhost:' + PORT];
const ALLOW = (process.env.ALLOW_ORIGIN || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
const PAGE = path.join(__dirname, '..', 'index.html');
const KNOWN = ['SessionStart', 'SubagentStart', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop'];
const MAX_BODY = 64 * 1024;

const clients = new Set();
const history = [];

function clean(o) {
  if (!o || typeof o !== 'object') return null;
  if (typeof o.agent_id !== 'string' || !o.agent_id || KNOWN.indexOf(o.event) < 0) return null;
  const s = function (v, n) { return typeof v === 'string' ? v.slice(0, n) : undefined; };
  const out = { agent_id: o.agent_id.slice(0, 64), event: o.event };
  ['name', 'mission', 'parent_id', 'tool', 'input', 'message'].forEach(function (k) { const v = s(o[k], k === 'input' || k === 'message' ? 200 : 80); if (v !== undefined) out[k] = v; });
  if (o.result === 'pass' || o.result === 'fail') out.result = o.result;
  return out;
}

function hostOk(req) { return SELF.some(function (s) { return s === 'http://' + req.headers.host; }); }
function originOk(origin) { return !origin || SELF.indexOf(origin) >= 0 || ALLOW.indexOf(origin) >= 0; }
function cors(req, res) {
  const o = req.headers.origin;
  if (o && originOk(o)) {
    res.setHeader('Access-Control-Allow-Origin', o);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
}

function broadcast(ev) {
  history.push(ev); if (history.length > 50) history.shift();
  const line = 'data: ' + JSON.stringify(ev) + '\n\n';
  clients.forEach(function (c) { c.write(line); });
}

const server = http.createServer(function (req, res) {
  if (!hostOk(req)) { res.writeHead(403); res.end('Hôte refusé'); return; }
  cors(req, res);
  const url = req.url.split('?')[0];

  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && url === '/event') {
    if (!originOk(req.headers.origin)) { res.writeHead(403); res.end(); return; }
    let body = '', big = false;
    req.on('data', function (d) { body += d; if (body.length > MAX_BODY) { big = true; req.destroy(); } });
    req.on('end', function () {
      if (big) return;
      let ev = null;
      try { ev = clean(JSON.parse(body)); } catch (e) { /* ignoré */ }
      if (!ev) { res.writeHead(400); res.end('Événement invalide'); return; }
      broadcast(ev); res.writeHead(204); res.end();
    });
    return;
  }

  if (req.method === 'GET' && url === '/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(': connecté\n\n');
    history.forEach(function (ev) { res.write('data: ' + JSON.stringify(ev) + '\n\n'); });
    clients.add(res);
    const hb = setInterval(function () { res.write(': ·\n\n'); }, 15000);
    req.on('close', function () { clearInterval(hb); clients.delete(res); });
    return;
  }

  if (req.method === 'GET' && url === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); return; }

  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    fs.readFile(PAGE, 'utf8', function (err, html) {
      if (err) { res.writeHead(404); res.end('index.html introuvable à côté du dossier relay/'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html.replace('<!--RELAY-->', '<meta name="relay" content="same">'));
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, HOST, function () {
  console.log('Relais prêt : http://' + HOST + ':' + PORT + '  (ouvrez cette adresse dans votre navigateur)');
  if (ALLOW.length) console.log('Origines autorisées en plus : ' + ALLOW.join(', '));
});
