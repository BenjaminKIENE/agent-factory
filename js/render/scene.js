// Dessin d'une image complète : décor du thème, sol, zones, ouvriers triés en profondeur,
// particules, étiquettes et pastilles d'état.

import { REDUCED } from '../config.js';
import { EXPIRE, actionShort } from '../core/events.js';
import { clamp } from '../core/util.js';
import { H0, N, ORDERED, P, STATIONS, W0, stationById } from '../core/world.js';
import { C, FB, FD, Tt, animT, cssW, ctx, dpr, sc, theme } from './canvas.js';
import { box, hsh, mix, poly, rgba, rr, seg, stationPolys } from './draw-kit.js';
import { visList, workerK } from '../sim/simulation.js';
import { app } from '../store.js';

export const chipRects = {}, labelRects = {};   // zones cliquables des pastilles et étiquettes (pour le survol)

/* ---------- sol, bords, zones ---------- */
/** Dessine le sol (damier, planches ou pavés selon le thème), les bords et le tapis coloré de chaque zone.
 *  `busy` : nombre d'agents au travail par zone (une zone active s'éclaire). */
function drawFloor(busy) {
  const F = theme.floor, T2 = Tt(animT), th = F.thick || 14;
  if (theme.edge) theme.edge(T2, 'under');
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const alt = (i + j) % 2, hv = hsh(i, j);
      if (F.kind === 'planks') {
        const base = alt ? C.floorA : C.floorB;
        for (let k = 0; k < 3; k++) {
          const a = j + k / 3, b = j + (k + 1) / 3;
          poly([P(i, a), P(i + 1, a), P(i + 1, b), P(i, b)], mix(base, hv > 0.5 ? '#000000' : '#ffffff', 0.05 + hsh(i * 3 + k, j) * 0.1), rgba('#000000', 0.28), 0.8);
        }
      } else if (F.kind === 'cobble') {
        const base = mix(alt ? C.floorA : C.floorB, hv > 0.5 ? '#000000' : '#ffffff', 0.05 + hv * 0.08);
        poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], base, rgba('#000000', 0.35), 1);
        poly([P(i + 0.1, j + 0.12), P(i + 0.9, j + 0.1), P(i + 0.88, j + 0.9), P(i + 0.12, j + 0.88)], null, rgba('#000000', 0.16), 0.8);
        if (hv > 0.78) seg(P(i + 0.2, j + 0.3), P(i + 0.55, j + 0.62), rgba('#000000', 0.3), 0.8);
      } else {
        poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], alt ? C.floorA : C.floorB);
        if (F.inset) poly([P(i + 0.08, j + 0.08), P(i + 0.92, j + 0.08), P(i + 0.92, j + 0.92), P(i + 0.08, j + 0.92)], null, rgba(F.insetCol || '#000000', F.insetA || 0.28), 0.7);
      }
    }
  }
  if (F.grid) {
    ctx.globalAlpha = F.grid;
    for (let i = 0; i <= N; i++) { seg(P(i, 0), P(i, N), F.gridCol || C.line, 0.7); seg(P(0, i), P(N, i), F.gridCol || C.line, 0.7); }
    ctx.globalAlpha = 1;
  }
  // épaisseur du plateau
  poly([P(0, N, 0), P(N, N, 0), P(N, N, -th), P(0, N, -th)], mix(C.slab, '#000000', 0.18), rgba('#000000', 0.5), 1);
  poly([P(N, N, 0), P(N, 0, 0), P(N, 0, -th), P(N, N, -th)], mix(C.slab, '#000000', 0.4), rgba('#000000', 0.5), 1);
  if (theme.edge) theme.edge(T2, 'over');
  // zones au sol
  STATIONS.forEach(function (s) {
    const col = C.st[s.id], on = busy[s.id] > 0;
    const q = [P(s.x - 0.3, s.y - 0.3), P(s.x + s.w + 0.3, s.y - 0.3), P(s.x + s.w + 0.3, s.y + s.d + 0.9), P(s.x - 0.3, s.y + s.d + 0.9)];
    const q2 = [P(s.x - 0.15, s.y - 0.15), P(s.x + s.w + 0.15, s.y - 0.15), P(s.x + s.w + 0.15, s.y + s.d + 0.7), P(s.x - 0.15, s.y + s.d + 0.7)];
    if (F.pad === 'neon') {
      poly(q, rgba(col, on ? 0.26 : 0.07), rgba(col, on ? 1 : 0.5), 1.6);
      ctx.setLineDash([4, 5]); poly(q2, null, rgba(col, 0.45), 1); ctx.setLineDash([]);
    } else if (F.pad === 'rug') {
      poly(q, rgba(col, on ? 0.62 : 0.46), rgba(mix(col, '#000000', 0.5), 0.9), 2);
      poly(q2, null, rgba(mix(col, '#ffffff', 0.45), 0.8), 1.4);
      ctx.setLineDash([3, 4]); poly([P(s.x - 0.02, s.y - 0.02), P(s.x + s.w + 0.02, s.y - 0.02), P(s.x + s.w + 0.02, s.y + s.d + 0.5), P(s.x - 0.02, s.y + s.d + 0.5)], null, rgba('#ffffff', 0.35), 1); ctx.setLineDash([]);
    } else {
      poly(q, rgba(col, on ? 0.3 : 0.17), rgba(col, 0.85), 2.2);
    }
  });
  ctx.setLineDash([7, 6]);
  seg(P(1, 7.5), P(8, 7.5), rgba(F.lane || C.hat, 0.85), 1.8);
  seg(P(6.5, 3.2), P(6.5, 7.5), rgba(F.lane || C.hat, 0.85), 1.8);
  ctx.setLineDash([]);
  const en = F.entry || [C.hat, '#14181F'];
  for (let k = 0; k < 8; k++) {
    const x0 = 3.5 + k * 0.25;
    poly([P(x0, 8.7), P(x0 + 0.25, 8.7), P(x0 + 0.25, 9), P(x0, 9)], k % 2 ? en[1] : en[0]);
  }
  STATIONS.forEach(function (s) {
    if (!busy[s.id]) return;
    const c = P(s.x + s.w / 2, s.y + s.d / 2 + 0.4);
    ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, 0.5);
    const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 84);
    g.addColorStop(0, rgba(C.st[s.id], F.halo || 0.4)); g.addColorStop(1, rgba(C.st[s.id], 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 84, 0, 6.283); ctx.fill();
    ctx.restore();
  });
}

function drawShadow(s) {
  ctx.globalAlpha = Math.min(0.26, 0.09 + s.h / 380) * (theme.shadow || 1);
  poly([P(s.x, s.y), P(s.x + s.w + 0.5, s.y + 0.1), P(s.x + s.w + 0.5, s.y + s.d + 0.5), P(s.x + 0.1, s.y + s.d + 0.5)], '#000000');
  ctx.globalAlpha = 1;
}
function drawProp(p) {
  drawShadow(p);
  (p.kind === 'crates' ? theme.props.a : theme.props.b)(p.x, p.y, Tt(animT));
}
function drawStation(s, T, busy) {
  drawShadow(s);
  const g = C.st[s.id], bm = theme.base, live = busy[s.id] > 0, tt = Tt(T);
  box(s.x, s.y, s.w, s.d, s.h, bm.k ? mix(g, bm.c, bm.k) : g, 0);
  if (bm.trim) {
    const t = s.h;
    poly([P(s.x, s.y, t), P(s.x + s.w, s.y, t), P(s.x + s.w, s.y + s.d, t), P(s.x, s.y + s.d, t)], null, rgba(g, 0.95), 1.8);
    seg(P(s.x + s.w, s.y + s.d, 0), P(s.x + s.w, s.y + s.d, t), rgba(g, 0.95), 1.6);
    seg(P(s.x, s.y + s.d, 0), P(s.x, s.y + s.d, t), rgba(g, 0.6), 1.2);
    seg(P(s.x + s.w, s.y, 0), P(s.x + s.w, s.y, t), rgba(g, 0.6), 1.2);
  }
  theme.deco[s.id](s, tt, live, g);
}

function drawLabel(s, fs) {
  const p = P(s.x + s.w / 2, s.y + s.d / 2, s.h + 16);
  ctx.font = '700 ' + (fs * (theme.fs && theme.fs.lab || 1)) + 'px ' + FD();
  const tw = ctx.measureText(s.label).width, w = tw + fs + 12, h = fs + 8;
  labelRects[s.id] = { x: p[0] - w / 2, y: p[1] - h / 2, w: w, h: h };
  ctx.globalAlpha = 0.95; rr(p[0] - w / 2, p[1] - h / 2, w, h, theme.ui.rad); ctx.fillStyle = C.surface; ctx.fill(); ctx.globalAlpha = 1;
  ctx.strokeStyle = C.st[s.id]; ctx.lineWidth = 1.8; ctx.stroke();
  ctx.fillStyle = C.st[s.id]; ctx.fillRect(p[0] - w / 2 + 5, p[1] - fs / 2 + 1, fs * 0.6, fs * 0.6);
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(s.label, p[0] - w / 2 + 5 + fs * 0.6 + 5, p[1] + 1);
}

/** Opacité d'un ouvrier : apparition en fondu à l'arrivée, disparition en fondu après « Stop ». */
function workerAlpha(a, v) {
  let al = clamp((app.simTime - v.born) / 400, 0, 1);
  if (a.status === 'done') al = Math.min(al, clamp((EXPIRE - (app.simTime - a.doneAt)) / 1200, 0, 1));
  return al;
}

/** Outil tenu par l'ouvrier selon la zone où il travaille (marteau, loupe, clavier…). */
function drawTool(station, x, y, k, T) {
  ctx.save(); ctx.translate(x, y);
  if (station === 'bench') {
    ctx.fillStyle = C.ink2; ctx.fillRect(-6 * k, -2 * k, 12 * k, 2 * k);
    ctx.fillStyle = '#0A100E'; ctx.fillRect(-5 * k, -10 * k, 10 * k, 8 * k);
    ctx.fillStyle = '#3EE07A'; ctx.fillRect(-4 * k, -8.6 * k, 5 * k, 1 * k); ctx.fillRect(-4 * k, -6.4 * k, 7 * k, 1 * k);
  } else if (station === 'library') {
    ctx.fillStyle = C.st.library; ctx.fillRect(-4.5 * k, -7 * k, 9 * k, 7 * k);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(-3.6 * k, -6 * k, 7.2 * k, 1.2 * k); ctx.fillRect(-3.6 * k, -3.6 * k, 5 * k, 1.2 * k);
  } else if (station === 'terminal') {
    ctx.fillStyle = '#0A100E'; ctx.fillRect(-4.5 * k, -8 * k, 9 * k, 6 * k);
    ctx.fillStyle = '#3EE07A'; ctx.fillRect(-3.4 * k, -6.6 * k, 4.6 * k, 1 * k); ctx.fillRect(-3.4 * k, -4.6 * k, 6 * k, 1 * k);
    ctx.fillStyle = '#7C8799'; ctx.fillRect(-5.5 * k, -2 * k, 11 * k, 1.8 * k);
  } else if (station === 'tests') {
    ctx.fillStyle = '#F2F5F8'; ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
    ctx.fillRect(-4 * k, -10 * k, 8 * k, 10 * k); ctx.strokeRect(-4 * k, -10 * k, 8 * k, 10 * k);
    ctx.beginPath(); ctx.moveTo(-2.4 * k, -5 * k); ctx.lineTo(-1 * k, -3.4 * k); ctx.lineTo(2.2 * k, -7.6 * k);
    ctx.strokeStyle = '#2E9B4F'; ctx.lineWidth = 1.6; ctx.stroke();
  } else if (station === 'plan') {
    ctx.fillStyle = '#F2C230'; ctx.fillRect(-4 * k, -8 * k, 8 * k, 8 * k);
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(-2.8 * k, -6 * k, 5.6 * k, 0.9 * k); ctx.fillRect(-2.8 * k, -3.6 * k, 4 * k, 0.9 * k);
  }
  ctx.restore();
}

/** Dessine un ouvrier : ombre, jambes, corps, tête, casque, accessoires du thème (back/torso/gear/walkFx). */
function drawWorker(a, v, T) {
  const K = workerK(a), k = K / 1.35, f = P(v.gx, v.gy);
  const ph = T * 10 + v.ph, walking = v.moving && !REDUCED, tt = Tt(T);
  const bob = REDUCED ? 0 : v.moving ? Math.abs(Math.sin(ph)) * 2 : a.status === 'working' ? Math.sin(T * 16 + v.ph) * 0.8 : 0;
  const col = C.ag[a.ci % 5], dark = mix(col, '#000000', 0.4), pants = mix(col, '#000000', 0.58);
  const outline = rgba(C.ink, 0.5);
  ctx.globalAlpha = workerAlpha(a, v);
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.beginPath(); ctx.ellipse(f[0], f[1] + 1, 9 * k * 1.1, 4.6 * k, 0, 0, 6.283); ctx.fill();
  if (theme.walkFx && v.moving && !REDUCED) theme.walkFx(f, K, bob, tt);
  const l1 = walking ? Math.max(0, Math.sin(ph)) * 2.2 * k : 0, l2 = walking ? Math.max(0, -Math.sin(ph)) * 2.2 * k : 0;
  ctx.fillStyle = theme.pants ? theme.pants(col) : pants;
  ctx.fillRect(f[0] - 4 * K, f[1] - 6.5 * K - l1, 3.2 * K, 6.5 * K);
  ctx.fillRect(f[0] + 0.8 * K, f[1] - 6.5 * K - l2, 3.2 * K, 6.5 * K);
  ctx.fillStyle = theme.boots || C.ink; ctx.fillRect(f[0] - 4.4 * K, f[1] - 1.2 * K - l1, 3.9 * K, 1.2 * K); ctx.fillRect(f[0] + 0.6 * K, f[1] - 1.2 * K - l2, 3.9 * K, 1.2 * K);
  const sa = walking ? Math.sin(ph) * 3 * k : 0;
  seg([f[0] - 6 * K, f[1] - 17 * K - bob], [f[0] - 7 * K, f[1] - 10 * K - bob - sa], dark, 3 * K);
  if (theme.back) theme.back(f, K, bob, col, tt, v.moving);
  rr(f[0] - 6 * K, f[1] - 19.5 * K - bob, 12 * K, 14 * K, 4 * K); ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  if (theme.torso) theme.torso(f, K, bob, col, tt);
  let hx, hy;
  if (a.status === 'working' && !v.moving) {
    const sw = REDUCED ? 0 : Math.sin(T * 12 + v.ph) * 2.5 * k;
    hx = f[0] + 9.5 * K; hy = f[1] - 12.5 * K + sw - bob;
  } else if (a.status === 'waiting') {
    hx = f[0] + 8 * K; hy = f[1] - 25 * K - bob + (REDUCED ? 0 : Math.sin(T * 8) * 2);
  } else {
    hx = f[0] + 7 * K; hy = f[1] - 10 * K - bob + (walking ? -sa : 0);
  }
  seg([f[0] + 6 * K, f[1] - 17 * K - bob], [hx, hy], dark, 3 * K);
  ctx.beginPath(); ctx.arc(hx, hy, 1.7 * K, 0, 6.283); ctx.fillStyle = C.skin; ctx.fill();
  if (a.status === 'working' && !v.moving) drawTool(a.station, hx + 1 * K, hy, k, T);
  ctx.beginPath(); ctx.arc(f[0], f[1] - 24.5 * K - bob, 5.2 * K, 0, 6.283); ctx.fillStyle = C.skin; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#1B1B22'; ctx.fillRect(f[0] - 2.4 * K, f[1] - 24.8 * K - bob, 1.3 * K, 1.5 * K); ctx.fillRect(f[0] + 1.2 * K, f[1] - 24.8 * K - bob, 1.3 * K, 1.5 * K);
  theme.gear(f, K, bob, col, tt, a, outline);
  ctx.globalAlpha = 1;
}

function statusShort(a) {
  if (a.status === 'working') return actionShort(a.tool, a.station);
  if (a.status === 'waiting') return 'Attend';
  if (a.status === 'done') return 'Terminé';
  return 'Réfléchit';
}

function drawStatus(a, v, T) {
  const K = workerK(a), f = P(v.gx, v.gy), al = workerAlpha(a, v);
  const bob = REDUCED ? 0 : v.moving ? Math.abs(Math.sin(T * 10 + v.ph)) * 2 : 0;
  const top = f[1] - (theme.tall || 33) * K - bob;
  if (a.status === 'working') {
    ctx.globalAlpha = al;
    ctx.fillStyle = rgba(C.line, 0.9); ctx.fillRect(f[0] - 12, top + 1, 24, 3);
    const pos = (T * 1.4 + v.ph) % 1;
    ctx.fillStyle = C.st[a.station] || C.ink2; ctx.fillRect(f[0] - 12 + pos * 17, top + 1, 7, 3);
    ctx.globalAlpha = 1;
  } else if (a.status === 'waiting') {
    const by = top - 7 - (REDUCED ? 0 : Math.abs(Math.sin(T * 5)) * 4);
    ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(f[0], by, 9, 0, 6.283); ctx.fillStyle = C.warn; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#16201E'; ctx.font = '700 13px ' + FB(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('?', f[0], by + 1); ctx.globalAlpha = 1;
  } else if (a.status === 'done') {
    ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(f[0], top - 6, 8, 0, 6.283); ctx.fillStyle = C.ok; ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(f[0] - 3.5, top - 6); ctx.lineTo(f[0] - 0.8, top - 3); ctx.lineTo(f[0] + 4, top - 9); ctx.stroke();
    ctx.globalAlpha = 1;
  } else if (!v.moving) {
    for (let i = 0; i < 3; i++) {
      const on = REDUCED ? 1 : 0.35 + 0.65 * Math.max(0, Math.sin(T * 4 - i * 0.9));
      ctx.globalAlpha = al * on; ctx.beginPath(); ctx.arc(f[0] - 6 + i * 6, top - 4, 2.2, 0, 6.283); ctx.fillStyle = C.ink2; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function measureChip(a, fs) {
  const name = a.name, act = statusShort(a), m = theme.fs && theme.fs.chip || 1;
  ctx.font = '600 ' + (fs * m) + 'px ' + FB();
  const w1 = ctx.measureText(name).width;
  ctx.font = '500 ' + (fs * 0.88 * m) + 'px ' + FB();
  const w2 = ctx.measureText(act).width;
  return { name: name, act: act, w: Math.max(w1, w2) + 18, h: fs * 2 + 8, m: m };
}
function overlap(r, o) { return r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y; }
/** Place les pastilles d'état au-dessus des ouvriers en évitant qu'elles se chevauchent. */
function layoutChips(list, fs, T) {
  const items = list.map(function (it) {
    const a = it[0], v = it[1], K = workerK(a), f = P(v.gx, v.gy);
    const bob = REDUCED ? 0 : v.moving ? Math.abs(Math.sin(T * 10 + v.ph)) * 2 : 0;
    const m = measureChip(a, fs), headTop = f[1] - (theme.tall || 33) * K - bob;
    return { a: a, v: v, m: m, x: f[0], headTop: headTop, bottom: headTop - 22, f: f };
  });
  const placed = Object.keys(labelRects).map(function (k) { return labelRects[k]; });
  items.slice().sort(function (p, q) { return (q.v.gx + q.v.gy) - (p.v.gx + p.v.gy); }).forEach(function (it) {
    const left = it.x - it.m.w / 2;
    for (let g = 0; g < 10; g++) {
      const r = { x: left, y: it.bottom - it.m.h, w: it.m.w, h: it.m.h };
      let hit = null;
      for (let i = 0; i < placed.length; i++) if (overlap(r, placed[i])) { hit = placed[i]; break; }
      if (!hit) break;
      it.bottom = hit.y - 3;
    }
    placed.push({ x: left - 1, y: it.bottom - it.m.h - 1, w: it.m.w + 2, h: it.m.h + 2 });
  });
  return items;
}
function drawChip(it, fs) {
  const a = it.a, m = it.m, al = workerAlpha(a, it.v), col = C.ag[a.ci % 5];
  const left = it.x - m.w / 2, top = it.bottom - m.h;
  if (it.headTop - 14 - it.bottom > 8) {
    ctx.globalAlpha = al * 0.8; ctx.setLineDash([2, 2]); seg([it.x, it.bottom], [it.x, it.headTop - 12], col, 1.3); ctx.setLineDash([]);
  }
  ctx.globalAlpha = al * 0.97; rr(left, top, m.w, m.h, theme.ui.rad); ctx.fillStyle = C.surface; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(left, top, 5, m.h); ctx.restore();
  ctx.globalAlpha = al; rr(left, top, m.w, m.h, theme.ui.rad); ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = '600 ' + (fs * m.m) + 'px ' + FB();
  ctx.fillText(m.name, left + 10, top + fs * 0.5 + 4);
  ctx.fillStyle = C.ink2;
  ctx.font = '500 ' + (fs * 0.88 * m.m) + 'px ' + FB();
  ctx.fillText(m.act, left + 10, top + fs * 1.5 + 5);
  ctx.globalAlpha = 1;
  chipRects[a.id] = { x: left, y: top, w: m.w, h: m.h };
}

function drawParticles() {
  app.particles.forEach(function (p) {
    const k = clamp(p.life / p.max, 0, 1);
    ctx.globalAlpha = k;
    ctx.fillStyle = p.kind === 'ok' ? C.ok : p.kind === 'bad' ? C.bad : (theme.spark || C.hat);
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

/**
 * Dessine une image complète. Ordre (du fond vers l'avant) :
 *   1. décor et murs du thème, sol ;
 *   2. zones, décor et ouvriers mélangés en « painter's algorithm » : on trie par profondeur pour que
 *      ce qui est devant en iso recouvre ce qui est derrière ;
 *   3. liens parent -> sous-agent, particules, effets du thème, vignette ;
 *   4. étiquettes, pastilles d'état, surbrillance du survol, légende d'arrivée, HUD du thème.
 * @param {number} T temps d'animation en secondes
 */
export function draw(T) {
  if (!C || !cssW || !theme) return;
  ctx.setTransform(dpr * sc, 0, 0, dpr * sc, 0, 0);
  ctx.clearRect(0, 0, W0, H0);
  Object.keys(chipRects).forEach(function (k) { delete chipRects[k]; });
  const tt = Tt(T);
  const list = visList();
  const busy = { plan: 0, library: 0, bench: 0, terminal: 0, tests: 0, dock: 0 };
  list.forEach(function (it) { if (it[0].status === 'working') busy[it[0].station] += 1; });

  theme.bg(tt);
  theme.walls(tt);
  drawFloor(busy);

  const buckets = [];
  for (let i = 0; i <= ORDERED.length; i++) buckets.push([]);
  list.forEach(function (it) {
    const v = it[1];
    let idx = 0;
    for (let k = ORDERED.length - 1; k >= 0; k--) {
      const s = ORDERED[k];
      if (v.gx >= s.x + s.w || v.gy >= s.y + s.d) { idx = k + 1; break; }
    }
    buckets[idx].push(it);
  });
  for (let k = 0; k <= ORDERED.length; k++) {
    buckets[k].sort(function (p, q) { return (p[1].gx + p[1].gy) - (q[1].gx + q[1].gy); })
      .forEach(function (it) { drawWorker(it[0], it[1], T); });
    if (k < ORDERED.length) { if (ORDERED[k].prop) drawProp(ORDERED[k]); else drawStation(ORDERED[k], T, busy); }
  }
  list.forEach(function (it) {
    const a = it[0], v = it[1], pv = a.parentId && app.views[a.parentId];
    if (!pv) return;
    ctx.setLineDash([3, 3]); ctx.globalAlpha = 0.75 * workerAlpha(a, v);
    const p1 = P(v.gx, v.gy), p2 = P(pv.gx, pv.gy);
    seg([p1[0], p1[1] - 14], [p2[0], p2[1] - 14], C.ag[a.ci % 5], 1.6);
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  });
  drawParticles();
  if (theme.fx) theme.fx(tt);
  if (theme.vig) {
    const vg = ctx.createRadialGradient(W0 / 2, H0 * 0.55, H0 * 0.35, W0 / 2, H0 * 0.55, W0 * 0.62);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, rgba(theme.vigCol || '#000004', theme.vig));
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W0, H0);
  }

  const lblFs = (sc < 0.8 ? 8 : 9.5) / sc * (theme.fs && theme.fs.base || 1) * 1.2;
  STATIONS.forEach(function (s) { drawLabel(s, lblFs); });
  const chipFs = (sc < 0.8 ? 11 : 13) / sc;
  list.forEach(function (it) { drawStatus(it[0], it[1], T); });
  layoutChips(list, chipFs, T).sort(function (p, q) { return (p.v.gx + p.v.gy) - (q.v.gx + q.v.gy); })
    .forEach(function (it) { drawChip(it, chipFs); });

  if (app.hover) {
    ctx.lineJoin = 'round';
    if (app.hover.kind === 'station') {
      stationPolys(stationById(app.hover.id)).slice(0, 3).forEach(function (pl) { poly(pl, null, C.ink, 2.4); });
    } else if (app.views[app.hover.id] && app.state.agents[app.hover.id]) {
      const w = app.views[app.hover.id], f = P(w.gx, w.gy), r = workerK(app.state.agents[app.hover.id]) * 9.5;
      ctx.beginPath(); ctx.ellipse(f[0], f[1] + 1, r, r / 2, 0, 0, 6.283); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.4; ctx.stroke();
    }
  }
  ctx.font = '700 ' + (lblFs * 0.9) + 'px ' + FD(); ctx.fillStyle = rgba(theme.arriveCol || C.ink2, 0.95); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const e = P(4.5, 10.5);
  ctx.fillText(theme.txt.arrive, e[0], e[1]);
  if (theme.hud) theme.hud(tt, lblFs);
}
