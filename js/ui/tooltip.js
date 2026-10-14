// Survol / toucher : identifie la zone ou l'ouvrier sous le pointeur et affiche une infobulle.

import { actionLong } from '../core/events.js';
import { ORDERED, P, STATIONS, stationById } from '../core/world.js';
import { canvas, cssH, sc, stage } from '../render/canvas.js';
import { inPoly, stationPolys } from '../render/draw-kit.js';
import { chipRects, labelRects } from '../render/scene.js';
import { visList, visible, workerK } from '../sim/simulation.js';
import { app } from '../store.js';

const tip = document.getElementById('tip');

function hitTest(wx, wy) {
  const list = visList().sort(function (p, q) { return (q[1].gx + q[1].gy) - (p[1].gx + p[1].gy); });
  for (let i = 0; i < list.length; i++) {
    const a = list[i][0], v = list[i][1], K = workerK(a), f = P(v.gx, v.gy);
    if (Math.abs(wx - f[0]) <= 8 * K && wy >= f[1] - 33 * K && wy <= f[1] + 3) return { kind: 'worker', id: a.id };
    const cr = chipRects[a.id];
    if (cr && wx >= cr.x && wx <= cr.x + cr.w && wy >= cr.y && wy <= cr.y + cr.h) return { kind: 'worker', id: a.id };
  }
  for (let i = 0; i < STATIONS.length; i++) {
    const r = labelRects[STATIONS[i].id];
    if (r && wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) return { kind: 'station', id: STATIONS[i].id };
  }
  for (let k = ORDERED.length - 1; k >= 0; k--) {
    if (ORDERED[k].prop) continue;
    const pls = stationPolys(ORDERED[k]);
    for (let j = 0; j < pls.length; j++) if (inPoly(wx, wy, pls[j])) return { kind: 'station', id: ORDERED[k].id };
  }
  return null;
}

function tipFor(h) {
  if (!h) return null;
  if (h.kind === 'station') {
    const s = stationById(h.id);
    const here = visList().filter(function (it) { return it[0].station === s.id; }).map(function (it) { return it[0].name; });
    return { title: s.name, lines: [
      { text: s.desc },
      { text: 'Présents : ' + (here.length ? here.join(', ') : 'personne pour le moment') },
      { text: 'Outils Claude Code correspondants : ' + s.tools, mono: true }
    ] };
  }
  const a = app.state.agents[h.id];
  if (!a || !visible(a)) return null;
  const par = a.parentId && app.state.agents[a.parentId];
  const role = a.parentId ? 'Sous-agent de ' + (par ? par.name : 'un agent') : 'Agent principal';
  let etat = 'Réfléchit';
  if (a.status === 'working') etat = actionLong(a.tool, a.station) + (a.detail ? ' (' + a.detail + ')' : '');
  else if (a.status === 'waiting') etat = 'Attend votre accord' + (a.detail ? ' (' + a.detail + ')' : '');
  else if (a.status === 'done') etat = 'Mission terminée';
  const n = a.n;
  return { title: a.name, lines: [
    { text: role + (a.mission ? ' · mission : ' + a.mission : '') },
    { text: 'État : ' + etat },
    { text: 'Depuis son arrivée : ' + n.library + ' lectures, ' + n.bench + ' écritures, ' + n.terminal + ' commandes, ' + n.tests + ' tests', mono: true }
  ] };
}

export function updateTip() {
  canvas.style.cursor = app.hover ? 'help' : 'default';
  const t = app.hover && app.ptr ? tipFor(app.hover) : null;
  if (!t) { tip.hidden = true; return; }
  tip.textContent = '';
  const st = document.createElement('strong');
  st.textContent = t.title;
  tip.appendChild(st);
  t.lines.forEach(function (l) {
    const p = document.createElement('p');
    if (l.mono) p.className = 'mono';
    p.textContent = l.text;
    tip.appendChild(p);
  });
  tip.hidden = false;
  const sw = stage.clientWidth, tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = app.ptr.x + 14, y = app.ptr.y + 14;
  if (x + tw > sw - 6) x = Math.max(6, app.ptr.x - tw - 14);
  if (y + th > cssH - 6) y = Math.max(6, app.ptr.y - th - 14);
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

function setHover(e, toggle) {
  const r = canvas.getBoundingClientRect();
  const sx = e.clientX - r.left, sy = e.clientY - r.top;
  const h = hitTest(sx / sc, sy / sc);
  if (toggle && h && app.hover && h.kind === app.hover.kind && h.id === app.hover.id) app.hover = null;
  else app.hover = h;
  app.ptr = { x: sx, y: sy };
  updateTip();
}

export function initTooltip() {
  canvas.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch') setHover(e, false); });
  canvas.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') setHover(e, true); });
  canvas.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') { app.hover = null; updateTip(); } });
}
