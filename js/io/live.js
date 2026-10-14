// Connexion en direct : la page écoute le relais local (flux SSE) et injecte les événements
// reçus dans la même file que la démo. Voir relay/server.js pour l'autre extrémité.

import { KNOWN } from '../config.js';
import { enqueue, reset } from '../sim/simulation.js';
import { app } from '../store.js';
import { $, setStatus } from '../ui/dom.js';
import { renderPanels } from '../ui/panels.js';
import { restartDemo } from '../ui/session.js';
import { updateTip } from '../ui/tooltip.js';

let es = null;
function setLive(text, isErr) { setStatus('liveMsg', text, isErr); }
export function disconnectLive() { if (es) { es.close(); es = null; setLive('', false); } }
function connectLive(url) {
  disconnectLive();
  url = String(url).trim().replace(/\/+$/, '');
  if (!/^https?:\/\//.test(url)) { setLive('Adresse invalide : elle doit commencer par http:// ou https://', true); return; }
  reset(); app.mode = 'live'; app.hover = null; app.playing = true; $('btnPlay').textContent = 'Pause';
  renderPanels(); updateTip();
  setLive('Connexion à ' + url + '…', false);
  try { es = new EventSource(url + '/events'); } catch { setLive('Connexion impossible.', true); return; }
  es.onopen = function () { setLive('Connecté. En attente des actions de votre IA…', false); };
  es.onerror = function () { setLive('Relais injoignable, nouvelle tentative…', true); };
  es.onmessage = function (m) {
    let o;
    try { o = JSON.parse(m.data); } catch { return; }
    if (!o || typeof o.agent_id !== 'string' || KNOWN.indexOf(o.event) < 0) return;
    ['name', 'mission', 'parent_id', 'tool', 'input', 'message'].forEach(function (k) { if (o[k] !== undefined) o[k] = String(o[k]).slice(0, 120); });
    enqueue(app.simTime + 30, o);
    setLive('Connecté · dernier événement : ' + o.event, false);
  };
}

export function initLive() {
  $('btnLive').addEventListener('click', function () { connectLive($('relayUrl').value); });
  $('btnLiveOff').addEventListener('click', function () { disconnectLive(); if (app.mode === 'live') restartDemo(); });

  // Connexion automatique : ?relay=http://… dans l'adresse, ou page servie par le relais lui-même.
  let url = null;
  try { url = new URLSearchParams(location.search).get('relay'); } catch { /* ignoré */ }
  if (!url && document.querySelector('meta[name="relay"]')) url = location.origin;
  if (url) { $('relayUrl').value = url; connectLive(url); }
}
