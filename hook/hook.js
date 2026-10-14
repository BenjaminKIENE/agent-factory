#!/usr/bin/env node
'use strict';
/*
 * Hook Claude Code : lit le JSON envoyé par Claude Code sur stdin, le convertit au format de la scène
 * et l'envoie au relais local. Ne bloque jamais Claude Code : en cas de problème, il sort sans rien dire.
 *
 * Variables : AGENT_FACTORY_PORT (défaut 4317) · AGENT_FACTORY_REDACT=1 (n'envoie ni commandes, ni chemins, ni messages).
 */
const http = require('http');

const PORT = Number(process.env.AGENT_FACTORY_PORT) || 4317;
const REDACT = process.env.AGENT_FACTORY_REDACT === '1';
const TEST_RE = /\b(test|vitest|jest|pytest)\b/i;

function summarize(tool, input) {
  if (!input || typeof input !== 'object') return '';
  const v = input.file_path || input.path || input.command || input.pattern || input.url || input.query || input.description || input.prompt || '';
  return String(v).replace(/\s+/g, ' ').slice(0, 80);
}

function testResult(p) {
  if (p.tool_name !== 'Bash') return undefined;
  const r = p.tool_response;
  const code = r && typeof r === 'object' ? (r.exit_code !== undefined ? r.exit_code : r.exitCode !== undefined ? r.exitCode : r.returnCode) : undefined;
  if (typeof code === 'number') return code === 0 ? 'pass' : 'fail';
  if (r && typeof r === 'object' && (r.is_error || r.error || r.interrupted)) return 'fail';
  const t = typeof r === 'string' ? r : JSON.stringify(r || {});
  return /(\b\d+\s+failed\b|\bFAIL(ED)?\b|AssertionError)/.test(t) ? 'fail' : 'pass';
}

function toEvent(p) {
  const id = String(p.session_id || '').slice(0, 8) || 'session';
  const proj = p.cwd ? String(p.cwd).split(/[\\/]/).filter(Boolean).pop() || '' : '';
  const base = { agent_id: id, name: (proj || 'Claude') + ' #' + id.slice(0, 4) };
  switch (p.hook_event_name) {
    case 'SessionStart': return Object.assign(base, { event: 'SessionStart', mission: REDACT ? '' : proj });
    case 'PreToolUse': {
      let input = summarize(p.tool_name, p.tool_input);
      if (REDACT) input = TEST_RE.test(input) ? 'test' : '';
      return Object.assign(base, { event: 'PreToolUse', tool: String(p.tool_name || ''), input: input });
    }
    case 'PostToolUse': return Object.assign(base, { event: 'PostToolUse', tool: String(p.tool_name || ''), result: testResult(p) });
    case 'Notification': return Object.assign(base, { event: 'Notification', message: REDACT ? 'Autorisation demandée' : String(p.message || '') });
    case 'Stop': return Object.assign(base, { event: 'Stop' });
    default: return null;
  }
}

function send(ev) {
  const body = JSON.stringify(ev);
  const req = http.request({ host: '127.0.0.1', port: PORT, path: '/event', method: 'POST', timeout: 800, headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, function (res) { res.resume(); res.on('end', function () { process.exit(0); }); });
  req.on('error', function () { process.exit(0); });
  req.on('timeout', function () { process.exit(0); });
  req.end(body);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (d) { raw += d; if (raw.length > 2e6) raw = raw.slice(0, 2e6); });
process.stdin.on('end', function () {
  let p;
  try { p = JSON.parse(raw); } catch (e) { process.exit(0); }
  const ev = toEvent(p);
  if (!ev) process.exit(0);
  send(ev);
});
setTimeout(function () { process.exit(0); }, 2000);
