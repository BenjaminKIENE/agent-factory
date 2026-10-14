// Boîte à outils de dessin partagée par la scène et tous les thèmes :
// couleurs, polygones, faces isométriques (gauche/droite/dessus), fenêtres, murs, étoiles…

import { clamp } from '../core/util.js';
import { H0, N, P, W0 } from '../core/world.js';
import { Tt, animT, ctx } from './canvas.js';

function hex2rgb(h) {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(h);
  if (m) return [+m[1], +m[2], +m[3]];
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mix(h, t, k) {
  const a = hex2rgb(h), b = hex2rgb(t);
  return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }).join(',') + ')';
}
export function rgba(h, al) { const c = hex2rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al + ')'; }
export function poly(pts, fill, stroke, lw) {
  ctx.beginPath();
  pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.lineJoin = 'round'; ctx.stroke(); }
}
export function seg(a, b, col, w) {
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.stroke();
}
export function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export function box(x, y, w, d, h, base, z0) {
  z0 = z0 || 0;
  const top = z0 + h, edge = mix(base, '#000000', 0.5);
  poly([P(x, y + d, top), P(x + w, y + d, top), P(x + w, y + d, z0), P(x, y + d, z0)], mix(base, '#000000', 0.24), edge, 0.8);
  poly([P(x + w, y + d, top), P(x + w, y, top), P(x + w, y, z0), P(x + w, y + d, z0)], mix(base, '#000000', 0.4), edge, 0.8);
  poly([P(x, y, top), P(x + w, y, top), P(x + w, y + d, top), P(x, y + d, top)], mix(base, '#ffffff', 0.14), edge, 0.8);
}
export function stationPolys(s) {
  const t = s.h;
  return [
    [P(s.x, s.y + s.d, t), P(s.x + s.w, s.y + s.d, t), P(s.x + s.w, s.y + s.d, 0), P(s.x, s.y + s.d, 0)],
    [P(s.x + s.w, s.y + s.d, t), P(s.x + s.w, s.y, t), P(s.x + s.w, s.y, 0), P(s.x + s.w, s.y + s.d, 0)],
    [P(s.x, s.y, t), P(s.x + s.w, s.y, t), P(s.x + s.w, s.y + s.d, t), P(s.x, s.y + s.d, t)],
    [P(s.x - 0.25, s.y - 0.25), P(s.x + s.w + 0.25, s.y - 0.25), P(s.x + s.w + 0.25, s.y + s.d + 0.25), P(s.x - 0.25, s.y + s.d + 0.25)]
  ];
}
export function inPoly(x, y, pl) {
  let c = false;
  for (let i = 0, j = pl.length - 1; i < pl.length; j = i++) {
    const xi = pl[i][0], yi = pl[i][1], xj = pl[j][0], yj = pl[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}

/* --- primitives de dessin partagées par les thèmes --- */
export function hsh(i, j) { let h = (i * 374761393 + j * 668265263) ^ (i * 1274126177); h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; }
export function glowAt(x, y, r, col, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
}
export function lt(s, u, z) { return P(s.x + u, s.y + s.d, z); }          // face gauche (côté caméra)
export function rt(s, v, z) { return P(s.x + s.w, s.y + v, z); }          // face droite
export function tp(s, fx, fy, z) { return P(s.x + s.w * fx, s.y + s.d * fy, s.h + (z || 0)); } // dessus
export function lrect(s, u0, u1, z0, z1, fill, stroke, lw) { poly([lt(s, u0, z1), lt(s, u1, z1), lt(s, u1, z0), lt(s, u0, z0)], fill, stroke, lw); }
export function rrect(s, v0, v1, z0, z1, fill, stroke, lw) { poly([rt(s, v0, z1), rt(s, v1, z1), rt(s, v1, z0), rt(s, v0, z0)], fill, stroke, lw); }
export function lline(s, u0, u1, z, col, w) { seg(lt(s, u0, z), lt(s, u1, z), col, w); }
export function disc(p, rx, ry, fill, stroke, lw) {
  ctx.beginPath(); ctx.ellipse(p[0], p[1], rx, ry, 0, 0, 6.283);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
}
export function cyl(p, rx, h, fill, topFill) {
  ctx.fillStyle = fill; ctx.fillRect(p[0] - rx, p[1] - h, rx * 2, h);
  disc(p, rx, rx / 2, fill); disc([p[0], p[1] - h], rx, rx / 2, topFill || mix(fill, '#ffffff', 0.22));
}
export function flame(p, sz, t, sd) {
  const f = 1 + 0.25 * Math.sin(t * 18 + sd * 3);
  glowAt(p[0], p[1] - sz * 0.6, sz * 2.6, '#FF9A2E', 0.42);
  poly([[p[0] - sz * 0.5, p[1]], [p[0] + sz * 0.5, p[1]], [p[0] + Math.sin(t * 9 + sd) * sz * 0.25, p[1] - sz * 1.7 * f]], '#FF7A1A');
  poly([[p[0] - sz * 0.28, p[1]], [p[0] + sz * 0.28, p[1]], [p[0], p[1] - sz * 1.0 * f]], '#FFD45A');
}
export function wq(x0, y0, x1, y1, z0, z1) { return [P(x0, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y0, z1)]; }
export function wpt(side, u, z) { return side === 'R' ? P(u, 0, z) : P(0, u, z); }
export function winW(side, u0, u1, z0, z1, fill, frame, cross) {
  const a = wpt(side, u0, z0), b = wpt(side, u1, z0), c = wpt(side, u1, z1), d = wpt(side, u0, z1);
  poly([a, b, c, d], fill, frame, 1.4);
  if (cross) {
    seg(wpt(side, (u0 + u1) / 2, z0), wpt(side, (u0 + u1) / 2, z1), frame, 1.1);
    seg(wpt(side, u0, (z0 + z1) / 2), wpt(side, u1, (z0 + z1) / 2), frame, 1.1);
  }
}
export function wallPair(cR, cL, h, band) {
  poly(wq(0, 0, N, 0, 0, h), cR); poly(wq(0, 0, 0, N, 0, h), cL);
  if (band) {
    poly(wq(0, 0, N, 0, h - 7, h), band[0]); poly(wq(0, 0, 0, N, h - 7, h), band[1]);
    poly(wq(0, 0, N, 0, 0, 7), band[2] || band[0]); poly(wq(0, 0, 0, N, 0, 7), band[3] || band[1]);
  }
}
export function wallBricks(side, h, col, w, bw, bh) {
  for (let z = bh; z < h; z += bh) seg(wpt(side, 0, z), wpt(side, N, z), col, w);
  for (let r = 0, z = 0; z < h; z += bh, r++) for (let u = (r % 2 ? bw / 2 : 0) + bw; u < N; u += bw) seg(wpt(side, u, z), wpt(side, u, Math.min(h, z + bh)), col, w);
}
export function vgrad(y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(function (s2) { g.addColorStop(s2[0], s2[1]); });
  ctx.fillStyle = g; ctx.fillRect(0, y0, W0, y1 - y0);
}
export function stars(n, seed, c0) {
  let sd = seed; const r = function () { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const tt = Tt(animT);
  for (let i = 0; i < n; i++) {
    const x = r() * W0, y = r() * H0 * 0.7, rad = 0.4 + r() * 1.1, ph = r() * 6.28, sp = 0.6 + r() * 2;
    ctx.globalAlpha = clamp(0.4 + 0.45 * Math.sin(tt * sp + ph), 0.1, 0.95); ctx.fillStyle = c0 || '#FFFFFF'; ctx.fillRect(x, y, rad * 1.6, rad * 1.6);
  }
  ctx.globalAlpha = 1;
}
