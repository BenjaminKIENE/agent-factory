// Rejeu : l'utilisateur colle un événement JSON par ligne, la scène les rejoue.
// Copie aussi le journal de la session courante dans le même format.

import { KNOWN } from '../config.js';
import { disconnectLive } from './live.js';
import { enqueue, reset } from '../sim/simulation.js';
import { app } from '../store.js';
import { $, setStatus } from '../ui/dom.js';
import { renderPanels } from '../ui/panels.js';
import { updateTip } from '../ui/tooltip.js';

const EXAMPLE = [
  '{"ts":0,"event":"SessionStart","agent_id":"demo","name":"Mon agent","mission":"corriger un bug"}',
  '{"ts":1,"event":"PreToolUse","agent_id":"demo","tool":"TodoWrite","input":"plan"}',
  '{"ts":2.5,"event":"PostToolUse","agent_id":"demo","tool":"TodoWrite"}',
  '{"ts":3.5,"event":"PreToolUse","agent_id":"demo","tool":"Read","input":"src/app.ts"}',
  '{"ts":5,"event":"PostToolUse","agent_id":"demo","tool":"Read"}',
  '{"ts":6,"event":"PreToolUse","agent_id":"demo","tool":"Edit","input":"src/app.ts"}',
  '{"ts":8,"event":"PostToolUse","agent_id":"demo","tool":"Edit"}',
  '{"ts":9,"event":"PreToolUse","agent_id":"demo","tool":"Bash","input":"npm test"}',
  '{"ts":11.5,"event":"PostToolUse","agent_id":"demo","tool":"Bash","result":"pass"}',
  '{"ts":12.5,"event":"Stop","agent_id":"demo"}'
].join('\n');

function setMsg(text, isErr) { setStatus('replayMsg', text, isErr); }
function parseJsonl(text) {
  const out = [], errs = [];
  text.split('\n').forEach(function (line, i) {
    line = line.trim();
    if (!line) return;
    try {
      const o = JSON.parse(line);
      if (!o || typeof o !== 'object') throw new Error('objet JSON attendu');
      if (typeof o.agent_id !== 'string' || !o.agent_id) throw new Error('"agent_id" requis');
      if (KNOWN.indexOf(o.event) < 0) throw new Error('"event" doit valoir ' + KNOWN.join(', '));
      out.push(o);
    } catch (e) { errs.push('Ligne ' + (i + 1) + ' : ' + e.message); }
  });
  return { out: out, errs: errs };
}
function replay() {
  disconnectLive();
  const r = parseJsonl($('replayIn').value);
  if (r.errs.length) { setMsg(r.errs.slice(0, 2).join(' | '), true); return; }
  if (!r.out.length) { setMsg('Aucun événement à rejouer.', true); return; }
  if (r.out.length > 500) { setMsg('500 événements maximum.', true); return; }
  reset(); app.mode = 'replay'; app.hover = null;
  const allTs = r.out.every(function (o) { return typeof o.ts === 'number'; });
  const base = allTs ? r.out[0].ts : 0;
  r.out.forEach(function (o, i) {
    const ev = {};
    Object.keys(o).forEach(function (k) { if (k !== 'ts') ev[k] = o[k]; });
    enqueue(300 + (allTs ? (o.ts - base) * 1000 : i * 900), ev);
  });
  app.playing = true; $('btnPlay').textContent = 'Pause';
  renderPanels(); updateTip();
  setMsg(r.out.length + ' événements planifiés.', false);
}
function copyLog() {
  const text = app.eventLog.map(function (e) { return JSON.stringify(e); }).join('\n');
  function fallback() { $('replayIn').value = text; setMsg('Copie bloquée : le journal est dans la zone ci-dessous.', false); }
  try {
    navigator.clipboard.writeText(text).then(function () { setMsg('Journal copié (' + app.eventLog.length + ' événements).', false); }, fallback);
  } catch { fallback(); }
}

export function initReplay() {
  $('replayIn').value = EXAMPLE;
  $('btnReplay').addEventListener('click', replay);
  $('btnCopy').addEventListener('click', copyLog);
}
