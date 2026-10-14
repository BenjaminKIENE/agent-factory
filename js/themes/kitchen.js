// Thème « Cuisine de restaurant » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, glowAt, lline, lrect, lt, poly, rr, seg, tp, vgrad, wallPair, winW, wpt } from '../render/draw-kit.js';
import { app } from '../store.js';

function bg(T) {
  vgrad(0, H0, [[0, '#F8E8C8'], [1, '#EDC48A']]);
  glowAt(120, 60, 200, '#FFFFFF', 0.5);
  ctx.fillStyle = 'rgba(200,70,50,0.10)'; for (let x = 0; x < W0; x += 28) ctx.fillRect(x, 220, 14, H0); for (let y = 220; y < H0; y += 28) ctx.fillRect(0, y, W0, 14);
  for (let i = 0; i < 6; i++) { const ph = (T * 0.12 + i / 6) % 1; ctx.globalAlpha = (1 - ph) * 0.22; disc([60 + i * 110 + Math.sin(T + i) * 8, 220 - ph * 150], 14 + ph * 20, 14 + ph * 20, '#FFFFFF'); } ctx.globalAlpha = 1;
}
function walls(T) {
  wallPair('#F3F0E8', '#E6E1D4', 74, ['#C9C2B2', '#B8B1A0', '#B33A28', '#9C3020']);
  for (let z = 0; z < 74; z += 9) { seg(wpt('R', 0, z), wpt('R', N, z), 'rgba(100,90,70,0.22)', 0.8); seg(wpt('L', 0, z), wpt('L', N, z), 'rgba(100,90,70,0.28)', 0.8); }
  for (let u = 0; u < N; u += 1.1) { seg(wpt('R', u, 0), wpt('R', u, 74), 'rgba(100,90,70,0.16)', 0.8); seg(wpt('L', u, 0), wpt('L', u, 74), 'rgba(100,90,70,0.2)', 0.8); }
  winW('R', 5.4, 7.6, 24, 58, '#FFC879', '#8A5A2A', 1); winW('R', 5.4, 7.6, 40, 58, '#FF9A5C', '#8A5A2A', 0);
  winW('L', 5.4, 6.8, 30, 56, '#CFE8F2', '#8A5A2A', 1);
  // étagère à bocaux
  seg(wpt('L', 1, 40), wpt('L', 4.6, 40), '#8A5A2A', 3); [1.3, 1.8, 2.3, 3.0, 3.6, 4.1].forEach(function (u, i) { const p = wpt('L', u, 40); ctx.fillStyle = ['#C94A3A', '#E3B83A', '#6BAE4A'][i % 3]; ctx.fillRect(p[0] - 3, p[1] - 11, 6, 10); ctx.fillStyle = '#EEE'; ctx.fillRect(p[0] - 3.4, p[1] - 12.4, 6.8, 2); });
  // rail de casseroles
  const a = wpt('R', 0.9, 56), b = wpt('R', 4.8, 56); seg(a, b, '#6B7480', 2.4);
  [1.3, 2.0, 2.7, 3.4, 4.1].forEach(function (u, i) { const p = wpt('R', u, 56), sw = Math.sin(T * 1.2 + i) * 1.2; seg(p, [p[0] + sw, p[1] + 8], '#6B7480', 1); disc([p[0] + sw, p[1] + 13], 6.5, 3.4, i % 2 ? '#B8BFC8' : '#C9824A', '#4A4F58', 1); });
  const c = wpt('L', 7.4, 52); disc(c, 7, 7, '#FFF', '#4A4F58', 1.6); const an = T * 0.4; seg(c, [c[0] + Math.cos(an) * 5, c[1] + Math.sin(an) * 5], '#222', 1.2);
  [2, 6].forEach(function (u, i) { const p = P(u, 0, 70); seg(P(u, 0, 74), p, '#333', 1); glowAt(p[0], p[1] + 4, 22, '#FFD58A', 0.45); poly([[p[0] - 6, p[1] + 5], [p[0] + 6, p[1] + 5], [p[0] + 3, p[1] - 1], [p[0] - 3, p[1] - 1]], '#C94A3A'); });
}
function edge(T, ph) {
  if (ph !== 'over') return;
  seg(P(0, N, 0), P(N, N, 0), '#DDE3E8', 2.4); seg(P(N, N, 0), P(N, 0, 0), '#C5CCD2', 2.4);
  for (let i = 0; i < N; i++) { poly([P(i, N, -2), P(i + 1, N, -2), P(i + 1, N, -14), P(i, N, -14)], i % 2 ? 'rgba(168,110,60,0.55)' : 'rgba(140,90,48,0.55)'); poly([P(N, i, -2), P(N, i + 1, -2), P(N, i + 1, -14), P(N, i, -14)], i % 2 ? 'rgba(140,90,48,0.6)' : 'rgba(120,76,40,0.6)'); }
}
function steam(p, T, n, sd) { for (let k = 0; k < n; k++) { const ph = (T * 0.5 + k / n + sd) % 1; ctx.globalAlpha = (1 - ph) * 0.5; disc([p[0] + Math.sin(ph * 6 + k) * 4, p[1] - ph * 22], 3 + ph * 5, 3 + ph * 5, '#FFFFFF'); } ctx.globalAlpha = 1; }
const deco = {
  plan: function (s, T, live, g) {
    lline(s, 0.1, s.w - 0.1, s.h - 8, '#7A838D', 2.4);
    for (let k = 0; k < 6; k++) { const u = 0.22 + k * 0.28, sw = Math.sin(T * 1.5 + k) * 0.8, top = lt(s, u, s.h - 8); poly([[top[0] + sw, top[1]], [top[0] + 7 + sw, top[1]], [top[0] + 7 + sw, top[1] + 18], [top[0] + sw, top[1] + 18]], '#FFFDF4', '#B8AE96', 0.8); seg([top[0] + 1.5 + sw, top[1] + 5], [top[0] + 5.5 + sw, top[1] + 5], k % 2 ? '#C94A3A' : '#8A8F98', 1); seg([top[0] + 1.5 + sw, top[1] + 9], [top[0] + 5 + sw, top[1] + 9], '#8A8F98', 1); }
    const b = tp(s, 0.5, 0.5); disc([b[0], b[1] - 1], 8, 4, '#C9CFD6', '#6B7480', 1); ctx.beginPath(); ctx.ellipse(b[0], b[1] - 3, 6.5, 6, 0, Math.PI, 0); ctx.fillStyle = '#E8ECEF'; ctx.fill(); ctx.strokeStyle = '#6B7480'; ctx.lineWidth = 1; ctx.stroke(); disc([b[0], b[1] - 9], 1.6, 1.6, '#6B7480');
    if (live) { const ph = (T * 1.6) % 1; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = '#FFE08A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(b[0], b[1] - 3, 8 + ph * 14, 4 + ph * 7, 0, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
  },
  library: function (s, T, live, g) {
    for (let sh = 0; sh < 3; sh++) {
      const z = 8 + sh * 15; lline(s, 0.05, s.w - 0.05, z, '#8A5A2A', 2.2);
      for (let k = 0; k < 6; k++) { const u = 0.2 + k * 0.4, c = lt(s, u, z + 6), col = ['#C94A3A', '#E3B83A', '#6BAE4A', '#9A5C3A', '#E8782A'][(k + sh) % 5]; ctx.fillStyle = col; rr(c[0] - 5, c[1] - 6, 10, 12, 2); ctx.fill(); ctx.fillStyle = '#F4F0E4'; ctx.fillRect(c[0] - 5, c[1] - 8, 10, 2.4); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(c[0] - 3, c[1] - 1, 6, 3); }
    }
    const t = tp(s, 0.3, 0.5); for (let k = 0; k < 4; k++) disc([t[0] + k * 2.4, t[1] + 6 + k * 2], 2.6, 2.6, '#FFF4DA', '#C9B88A', 0.8);
  },
  bench: function (s, T, live, g) {
    poly([tp(s, 0.1, 0.1), tp(s, 0.7, 0.1), tp(s, 0.7, 0.9), tp(s, 0.1, 0.9)], '#C28A4C', '#7A5028', 1.2);
    [[0.25, 0.3, '#D9472B'], [0.45, 0.55, '#6BAE4A'], [0.3, 0.7, '#E8B83A']].forEach(function (v) { const p = tp(s, v[0], v[1], 1); disc([p[0], p[1] - 3], 4.2, 3.6, v[2], '#00000040', 0.8); });
    const bw = tp(s, 0.85, 0.7, 1); cyl(bw, 7, 6, '#D9DEE3'); disc([bw[0], bw[1] - 6], 5.4, 2.4, '#F2B84B');
    const kp = tp(s, 0.45, 0.35, 1), ph = live ? Math.abs(Math.sin(T * 9)) : 0.2, kx = kp[0] + 6, ky = kp[1] - 4 - 8 * ph;
    poly([[kx - 8, ky - 2], [kx + 6, ky - 4], [kx + 6, ky + 1], [kx - 8, ky + 1]], '#DDE3E8', '#6B7480', 0.8); seg([kx + 6, ky - 2], [kx + 14, ky - 4], '#3A2A1E', 3);
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.12, s.w - 0.12, 4, 22, '#2A2A2E', '#6B7480', 1.2); lrect(s, 0.2, s.w - 0.2, 7, 18, live ? '#FF9A3C' : '#5A3A2A'); if (live) glowAt(lt(s, 0.5, 12)[0], lt(s, 0.5, 12)[1], 18, '#FF9A3C', 0.5);
    for (let k = 0; k < 3; k++) { const c = lt(s, 0.2 + k * 0.3, 29); disc(c, 2.6, 2.6, '#1E1E22', '#C9CFD6', 1); seg(c, [c[0] + 1.6, c[1] - 1.6], '#FFF', 1); }
    const p = tp(s, 0.5, 0.5); cyl(p, 8, 11, '#B8BFC8'); disc([p[0], p[1] - 11], 8, 3.6, '#2A2A2E'); seg([p[0] - 9, p[1] - 8], [p[0] - 13, p[1] - 9], '#6B7480', 2);
    if (live) { for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + T; ctx.fillStyle = 'rgba(80,170,255,0.9)'; ctx.fillRect(p[0] + Math.cos(a) * 6, p[1] + 1 + Math.sin(a) * 3, 1.6, 2); } }
    steam([p[0], p[1] - 12], T, live ? 5 : 2, 0);
  },
  tests: function (s, T, live, g) {
    poly([tp(s, 0.08, 0.15), tp(s, 0.92, 0.15), tp(s, 0.92, 0.85), tp(s, 0.08, 0.85)], '#FFFFFF', '#C9CFD6', 1);
    [0.25, 0.6].forEach(function (u, i) { const p = tp(s, u, 0.5, 1); disc(p, 9, 4.2, '#FFFFFF', '#B8BFC8', 1); disc([p[0], p[1] - 1], 4, 2, ['#C94A3A', '#6BAE4A'][i]); });
    const c = tp(s, 0.42, 0.5, 1); ctx.beginPath(); ctx.ellipse(c[0], c[1] - 2, 12, 11, 0, Math.PI, 0); ctx.fillStyle = 'rgba(232,236,239,0.95)'; ctx.fill(); ctx.strokeStyle = '#7A838D'; ctx.lineWidth = 1.2; ctx.stroke(); disc([c[0], c[1] - 13], 1.8, 1.8, '#7A838D');
    ctx.beginPath(); ctx.arc(c[0] - 4, c[1] - 7, 3, Math.PI * 1.1, Math.PI * 1.6); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.stroke();
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#B8AE96'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.84, 0.5, 9); seg(tp(s, 0.84, 0.5), p, '#7A838D', 2.6); if (lamp || live) glowAt(p[0], p[1] - 3, 24, col, 0.6); disc([p[0], p[1] - 3], 5, 5, col, '#5A4A30', 1);
  },
  dock: function (s, T, live, g) {
    poly([P(s.x + 0.04, s.y, s.h), P(s.x + s.w - 0.04, s.y, s.h), P(s.x + s.w - 0.04, s.y + s.d, s.h), P(s.x + 0.04, s.y + s.d, s.h)], '#D9DEE3', '#8A939D', 1);
    for (let k = 0; k < 3; k++) { const y = s.y + 0.2 + ((T * 0.25 + k / 3) % 1) * (s.d - 0.4), p = P(s.x + 0.5, y, s.h + 1); disc(p, 7, 3.4, '#FFFFFF', '#B8BFC8', 1); disc([p[0], p[1] - 1.4], 3.4, 1.8, ['#C94A3A', '#E3B83A', '#6BAE4A'][k]); }
    const b = P(s.x + 0.5, s.y + s.d / 2, s.h); seg(P(s.x + 0.12, s.y + 0.1, s.h), [P(s.x + 0.12, s.y + 0.1, s.h)[0], P(s.x + 0.12, s.y + 0.1, s.h)[1] - 18], '#7A838D', 2); glowAt(b[0], b[1] - 20, 28, '#FFB347', 0.35); disc([b[0], b[1] - 20], 5, 2.4, '#FF9A3C');
  }
};
function veg(x, y) { box(x + 0.12, y + 0.12, 0.76, 0.76, 11, '#B98042', 0); [[0.3, 0.35, '#D9472B'], [0.55, 0.45, '#6BAE4A'], [0.4, 0.62, '#E8782A'], [0.68, 0.65, '#D9472B']].forEach(function (v) { const p = P(x + v[0], y + v[1], 12); disc([p[0], p[1] - 2], 4.2, 3.6, v[2]); }); }
function stockpot(x, y, T) { const p = P(x + 0.5, y + 0.5); cyl(p, 11, 16, '#C5CCD4'); seg([p[0] - 11, p[1] - 6], [p[0] + 11, p[1] - 6], 'rgba(0,0,0,0.2)', 1); disc([p[0] - 12, p[1] - 8], 2, 2, '#6B7480'); disc([p[0] + 12, p[1] - 8], 2, 2, '#6B7480'); steam([p[0], p[1] - 16], T, 4, 0.3); }
export default {
  name: 'Cuisine de restaurant', fonts: { d: 'Fraunces', b: 'Nunito', df: 'serif', bf: 'sans-serif' }, fs: { lab: 0.95, chip: 1.0 },
  ui: { bg: '#F6ECDD', surface: '#FFFBF3', ink: '#2E1F14', ink2: '#7A6450', line: '#E3D3BA', accent: '#C8452B', onAccent: '#FFFFFF', rad: 8, cssRad: '12px', upper: 0, ls: '0', h1: 'clamp(30px,6.5vw,46px)', stageBg: '#FFF6E6', bodyBg: 'none', stageBorder: '#D7BE97', stageShadow: '0 10px 30px rgba(120,70,30,.18)' },
  pal: { floorA: '#EDE6D6', floorB: '#7B7E86', slab: '#B7A27F', line: '#9A8E78', ink: '#2E1F14', ink2: '#7A6450', surface: '#FFFBF3', hat: '#E8782A', skin: '#F0C9A4', ok: '#2E9B4F', bad: '#D23B3B', warn: '#E0A100', glow: '#C8452B',
    st: { plan: '#D9503A', library: '#3E8E5A', bench: '#D99A2B', terminal: '#8A5CB0', tests: '#2E9BB5', dock: '#8A6A4A' }, ag: ['#D9472B', '#2B7CC0', '#9A5CC2', '#B89500', '#D14A8B'] },
  floor: { kind: 'checker', inset: 1, insetA: 0.12, grid: 0, pad: 'tape', thick: 14, lane: '#D9503A', entry: ['#D9503A', '#FFF8EA'], halo: 0.34 },
  base: { k: 0.66, c: '#E8ECEF' }, vig: 0.12, vigCol: '#6A3A10',
  txt: {
    title: 'La Brigade des Agents', arrive: 'ENTRÉE', noun: 'cuisinier',
    sub: "Chaque agent IA est un cuisinier de la brigade. Il se rend au poste de la cuisine qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un poste ou un cuisinier pour comprendre.",
    aria: "Cuisine de restaurant isométrique : des cuisiniers représentent des agents IA et se déplacent entre les postes.",
    zones: {
      plan: ['PASSE', 'Passe des commandes', "L'agent organise le service : il met à jour sa liste de tâches (les bons de commande) ou confie un plat à un sous-agent (un commis)."],
      library: ['RÉSERVE', 'Garde-manger', "L'agent va chercher les ingrédients : il lit des fichiers et cherche dans le code (ou sur le web) avant de cuisiner."],
      bench: ['PRÉPA', 'Plan de travail', "L'agent modifie ou crée des fichiers. C'est ici que le code est découpé, assemblé et préparé."],
      terminal: ['FOURNEAUX', 'Fourneaux', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. Ça chauffe !"],
      tests: ['DÉGUSTATION', 'Table de dégustation', "L'agent goûte le plat avant de le servir (il lance les tests). Le témoin devient vert si tout est bon, rouge sinon."],
      dock: ['SERVICE', 'Pass de service', "Les agents qui ont fini leur mission envoient leur plat en salle depuis le pass de service."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: veg, b: stockpot }, tall: 36,
  torso: function (f, K, bob) {
    ctx.fillStyle = 'rgba(255,255,255,0.96)'; ctx.fillRect(f[0] - 4.4 * K, f[1] - 15 * K - bob, 8.8 * K, 9.4 * K); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.8; ctx.strokeRect(f[0] - 4.4 * K, f[1] - 15 * K - bob, 8.8 * K, 9.4 * K);
    seg([f[0] - 4 * K, f[1] - 15 * K - bob], [f[0] - 6 * K, f[1] - 19 * K - bob], '#FFFFFF', 1.2 * K); seg([f[0] + 4 * K, f[1] - 15 * K - bob], [f[0] + 6 * K, f[1] - 19 * K - bob], '#FFFFFF', 1.2 * K);
  },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 27 * K - bob;
    ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.9;
    ctx.fillRect(f[0] - 5.2 * K, y - 1 * K, 10.4 * K, 3.4 * K); ctx.strokeRect(f[0] - 5.2 * K, y - 1 * K, 10.4 * K, 3.4 * K);
    [[-3.4, -5.5, 3.4], [0, -8, 4], [3.4, -5.5, 3.4]].forEach(function (c) { disc([f[0] + c[0] * K, y + c[1] * K], c[2] * K, c[2] * K, '#FFFFFF', 'rgba(0,0,0,0.25)', 0.9); });
  }
};
