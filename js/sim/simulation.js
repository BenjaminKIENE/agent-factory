// Moteur de simulation : file d'événements planifiés, état des agents, position des ouvriers,
// particules. Ne dessine rien : le rendu lit simplement l'objet `app` (voir store.js).

import { REDUCED } from '../config.js';
import { EXPIRE, emptyState, reduce } from '../core/events.js';
import { rnd } from '../core/util.js';
import { LOBBY, P, findPath, stationById } from '../core/world.js';
import { app } from '../store.js';

const eventHooks = [];
/** Enregistre une fonction appelée après chaque événement traité (utilisé par la démo). */
export function onEvent(fn) { eventHooks.push(fn); }

export function reset() {
  app.state = emptyState(); app.queue = []; app.views = {}; app.particles = []; app.simTime = 0;
  app.eventLog = []; app.agentCounter = 0; app.autoIds = new Set();
}
export function enqueue(at, ev) {
  let i = app.queue.length;
  while (i > 0 && app.queue[i - 1].at > at) i--;
  app.queue.splice(i, 0, { at: at, ev: ev });
}

function burst(kind, x, y, n) {
  if (REDUCED) return;
  for (let i = 0; i < n; i++) {
    app.particles.push({ kind: kind, x: x, y: y, vx: rnd(-45, 45), vy: rnd(-90, -25), g: 140, life: 0.7, max: 0.7, size: 3 });
  }
}

function dispatchDue() {
  while (app.queue.length && app.queue[0].at <= app.simTime) {
    const ev = app.queue.shift().ev;
    const sumBefore = app.state.tests.pass + app.state.tests.fail;
    app.state = reduce(app.state, ev, app.simTime);
    if (app.state.tests.pass + app.state.tests.fail !== sumBefore) {
      const ts = stationById('tests'), lp = P(ts.x + ts.w / 2, ts.y + ts.d / 2, ts.h + 12);
      burst(app.state.lamps.tests === 'pass' ? 'ok' : 'bad', lp[0], lp[1], 16);
    }
    app.eventLog.push(Object.assign({ ts: Math.round(app.simTime / 100) / 10 }, ev));
    if (app.eventLog.length > 400) app.eventLog.shift();
    eventHooks.forEach(function (fn) { fn(ev); });
  }
}

export function visible(a) { return !(a.status === 'done' && app.simTime - a.doneAt > EXPIRE); }
export function visList() {
  const list = [];
  app.state.order.forEach(function (id) {
    const a = app.state.agents[id], v = app.views[id];
    if (a && v && visible(a)) list.push([a, v]);
  });
  return list;
}
export function workerK(a) { return a.parentId ? 1.05 : 1.35; }

function getView(a) {
  let v = app.views[a.id];
  if (!v) {
    const pv = a.parentId && app.views[a.parentId];
    v = { gx: pv ? pv.gx : 4.5 + (Math.random() - 0.5), gy: pv ? pv.gy : 9.8, tx: null, ty: null, path: [], moving: false, ph: Math.random() * 6.28, born: app.simTime, si: 0 };
    app.views[a.id] = v;
  }
  return v;
}

function updateViews(dtSim) {
  const groups = {};
  app.state.order.forEach(function (id) {
    const a = app.state.agents[id];
    if (!a || !visible(a)) return;
    const k = a.station || 'lobby';
    (groups[k] = groups[k] || []).push(a);
  });
  Object.keys(groups).forEach(function (k) {
    const slots = k === 'lobby' ? LOBBY : stationById(k).slots;
    groups[k].forEach(function (a, i) {
      const v = getView(a), sl = slots[i % slots.length];
      v.si = i;
      if (v.tx !== sl[0] || v.ty !== sl[1]) { v.tx = sl[0]; v.ty = sl[1]; v.path = findPath(v.gx, v.gy, v.tx, v.ty); }
    });
  });
  Object.keys(app.views).forEach(function (id) {
    const a = app.state.agents[id];
    if (!a || !visible(a)) { delete app.views[id]; return; }
    const v = app.views[id];
    v.moving = false;
    if (v.path.length) {
      const wx = v.path[0][0], wy = v.path[0][1];
      const dx = wx - v.gx, dy = wy - v.gy, dist = Math.hypot(dx, dy), len = 2.6 * dtSim;
      if (dist <= len) { v.gx = wx; v.gy = wy; v.path.shift(); }
      else { v.gx += dx / dist * len; v.gy += dy / dist * len; }
      v.moving = true;
    }
    if (!REDUCED && a.status === 'working' && a.station === 'bench' && !v.moving && Math.random() < dtSim * 14) {
      const p = P(v.gx + 0.25, v.gy - 0.3, 14);
      app.particles.push({ kind: 'spark', x: p[0], y: p[1], vx: rnd(-26, 26), vy: rnd(-70, -30), g: 160, life: 0.45, max: 0.45, size: 2.2 });
    }
  });
  for (let i = app.particles.length - 1; i >= 0; i--) {
    const p = app.particles[i];
    p.life -= dtSim; p.x += p.vx * dtSim; p.y += p.vy * dtSim; p.vy += p.g * dtSim;
    if (p.life <= 0) app.particles.splice(i, 1);
  }
}

export function advance(msSim) {
  app.simTime += msSim;
  dispatchDue();
  updateViews(msSim / 1000);
}
export function warm() { for (let i = 0; i < 260; i++) advance(50); }
