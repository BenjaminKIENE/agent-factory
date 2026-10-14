#!/usr/bin/env node
'use strict';
/*
 * Relais local
 *   POST /event   reçoit un événement (envoyé par hook/hook.js ou par n'importe quel outil)
 *   GET  /events  flux SSE : la page y reçoit les événements en direct
 *   GET  /        sert la page (index.html + css/ + js/) sur http://127.0.0.1:PORT
 *   GET  /health  « ok » (pour vérifier que le relais tourne)
 *
 * Aucune dépendance. N'écoute que sur 127.0.0.1.
 *
 * Variables d'environnement :
 *   PORT          port d'écoute (défaut 4317)
 *   ALLOW_ORIGIN  origines autorisées à lire le flux, séparées par des virgules
 *                 (ex. https://monsite.fr) — seulement si la page est hébergée ailleurs.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------- Configuration ----------
const PORT = Number(process.env.PORT) || 4317;
const HOST = '127.0.0.1';
const SELF_ORIGINS = ['http://127.0.0.1:' + PORT, 'http://localhost:' + PORT];
const EXTRA_ORIGINS = (process.env.ALLOW_ORIGIN || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

const ROOT = path.join(__dirname, '..');            // dossier du projet (là où est index.html)
const STATIC_DIRS = ['css', 'js'];                  // seuls dossiers servis, avec index.html
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

const KNOWN_EVENTS = ['SessionStart', 'SubagentStart', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop'];
const MAX_BODY = 64 * 1024;                         // taille maximale d'un POST
const HISTORY_SIZE = 50;                            // événements rejoués à une page qui se connecte

const sseClients = new Set();
const history = [];

// ---------- Validation : on ne transmet que des champs connus, tronqués ----------
function sanitizeEvent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.agent_id !== 'string' || !raw.agent_id || KNOWN_EVENTS.indexOf(raw.event) < 0) return null;

  const text = function (value, max) { return typeof value === 'string' ? value.slice(0, max) : undefined; };
  const out = { agent_id: raw.agent_id.slice(0, 64), event: raw.event };
  ['name', 'mission', 'parent_id', 'tool', 'input', 'message'].forEach(function (key) {
    const max = key === 'input' || key === 'message' ? 200 : 80;
    const value = text(raw[key], max);
    if (value !== undefined) out[key] = value;
  });
  if (raw.result === 'pass' || raw.result === 'fail') out.result = raw.result;
  return out;
}

// ---------- Sécurité : Host (anti DNS-rebinding) et Origin (anti sites tiers) ----------
function hostAllowed(req) {
  return SELF_ORIGINS.some(function (origin) { return origin === 'http://' + req.headers.host; });
}
function originAllowed(origin) {
  return !origin || SELF_ORIGINS.indexOf(origin) >= 0 || EXTRA_ORIGINS.indexOf(origin) >= 0;
}
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (!origin || !originAllowed(origin)) return;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
}

// ---------- Diffusion ----------
function broadcast(ev) {
  history.push(ev);
  if (history.length > HISTORY_SIZE) history.shift();
  const frame = 'data: ' + JSON.stringify(ev) + '\n\n';
  sseClients.forEach(function (client) { client.write(frame); });
}

// ---------- Routes ----------
function handlePreflight(res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(204); res.end();
}

function handlePostEvent(req, res) {
  if (!originAllowed(req.headers.origin)) { res.writeHead(403); res.end(); return; }
  let body = '', tooBig = false;
  req.on('data', function (chunk) {
    body += chunk;
    if (body.length > MAX_BODY) { tooBig = true; req.destroy(); }
  });
  req.on('end', function () {
    if (tooBig) return;
    let ev = null;
    try { ev = sanitizeEvent(JSON.parse(body)); } catch (e) { /* JSON invalide : traité ci-dessous */ }
    if (!ev) { res.writeHead(400); res.end('Événement invalide'); return; }
    broadcast(ev);
    res.writeHead(204); res.end();
  });
}

function handleEventStream(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.write(': connecté\n\n');
  history.forEach(function (ev) { res.write('data: ' + JSON.stringify(ev) + '\n\n'); });
  sseClients.add(res);
  const heartbeat = setInterval(function () { res.write(': ·\n\n'); }, 15000);   // garde la connexion ouverte
  req.on('close', function () { clearInterval(heartbeat); sseClients.delete(res); });
}

/** Sert index.html, css/* et js/*. Tout autre chemin (ou tentative de sortir du dossier) -> 404. */
function handleStatic(url, res) {
  let rel;
  try { rel = url === '/' ? 'index.html' : decodeURIComponent(url).replace(/^\/+/, ''); }
  catch (e) { res.writeHead(400); res.end(); return; }          // pourcentage mal formé
  const file = path.resolve(ROOT, rel);
  // Autorisé : index.html, ou un .css/.js situé réellement DANS css/ ou js/ (après résolution des « .. »).
  const inStaticDir = STATIC_DIRS.some(function (dir) { return file.indexOf(path.join(ROOT, dir) + path.sep) === 0; });
  const allowed = file === path.join(ROOT, 'index.html') || (inStaticDir && MIME[path.extname(file)]);
  if (!allowed || rel.indexOf('\0') >= 0) { res.writeHead(404); res.end(); return; }

  fs.readFile(file, 'utf8', function (err, content) {
    if (err) { res.writeHead(404); res.end('Fichier introuvable'); return; }
    if (file === path.join(ROOT, 'index.html')) content = content.replace('<!--RELAY-->', '<meta name="relay" content="same">');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)], 'Cache-Control': 'no-cache' });
    res.end(content);
  });
}

const server = http.createServer(function (req, res) {
  if (!hostAllowed(req)) { res.writeHead(403); res.end('Hôte refusé'); return; }
  setCorsHeaders(req, res);
  const url = req.url.split('?')[0];

  if (req.method === 'OPTIONS') return handlePreflight(res);
  if (req.method === 'POST' && url === '/event') return handlePostEvent(req, res);
  if (req.method === 'GET' && url === '/events') return handleEventStream(req, res);
  if (req.method === 'GET' && url === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); return; }
  if (req.method === 'GET') return handleStatic(url, res);
  res.writeHead(404); res.end();
});

server.listen(PORT, HOST, function () {
  console.log('Relais prêt : http://' + HOST + ':' + PORT + '  (ouvrez cette adresse dans votre navigateur)');
  if (EXTRA_ORIGINS.length) console.log('Origines autorisées en plus : ' + EXTRA_ORIGINS.join(', '));
});
