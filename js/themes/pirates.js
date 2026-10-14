// Thème « Navire pirate » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, glowAt, lline, lrect, lt, mix, poly, rr, seg, stars, tp, vgrad, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

function bg(T) {
  vgrad(0, 232, [[0, '#1B2557'], [0.55, '#B8456B'], [1, '#F6A94C']]);
  stars(40, 5, '#FFE9D0');
  glowAt(470, 230, 150, '#FFD27A', 0.5); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W0, 232); ctx.clip(); disc([470, 232], 48, 48, '#FFE08A'); ctx.restore();
  vgrad(232, H0, [[0, '#2B7A9A'], [0.4, '#145A7C'], [1, '#08283F']]);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 232, W0, H0); ctx.clip();
  for (let i = 0; i < 7; i++) { const w = 70 - i * 7; ctx.globalAlpha = 0.5 - i * 0.05; ctx.fillStyle = '#FFD27A'; ctx.fillRect(470 - w / 2 + Math.sin(T * 2 + i) * 4, 236 + i * 9, w, 2); }
  ctx.globalAlpha = 0.35; ctx.strokeStyle = '#BFE9F4'; ctx.lineWidth = 1;
  for (let r = 0; r < 12; r++) { const y = 246 + r * 14; ctx.beginPath(); for (let x = -10; x < W0 + 10; x += 6) { const yy = y + Math.sin(x * 0.05 + T * 1.6 + r) * 2.2; if (x === -10) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
  // navire lointain
  const sx = 120 + Math.sin(T * 0.1) * 14, sy = 228; poly([[sx - 18, sy], [sx + 18, sy], [sx + 12, sy + 6], [sx - 12, sy + 6]], '#1A1A28'); seg([sx, sy], [sx, sy - 28], '#1A1A28', 1.6); poly([[sx + 1, sy - 26], [sx + 14, sy - 8], [sx + 1, sy - 4]], '#2A2438'); poly([[sx - 1, sy - 22], [sx - 12, sy - 8], [sx - 1, sy - 4]], '#2A2438');
  // mouettes
  for (let i = 0; i < 3; i++) { const x = ((T * 16 + i * 210) % (W0 + 40)) - 20, y = 70 + i * 22 + Math.sin(T * 2 + i) * 6, w = Math.sin(T * 8 + i) * 3; ctx.strokeStyle = '#2B1E2E'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 7, y - w); ctx.quadraticCurveTo(x - 3, y - 4, x, y); ctx.quadraticCurveTo(x + 3, y - 4, x + 7, y - w); ctx.stroke(); }
}
function walls(T) {
  // bastingage en bois + cordages
  const h = 20, wood = '#6B4526', hi = '#A56B38';
  poly(wq(0, 0, N, 0, 0, h), 'rgba(40,20,8,0.35)'); poly(wq(0, 0, 0, N, 0, h), 'rgba(40,20,8,0.45)');
  seg(P(0, 0, h), P(N, 0, h), hi, 4); seg(P(0, 0, h), P(0, N, h), mix(hi, '#000', 0.2), 4);
  for (let i = 0; i <= 9; i++) { seg(P(i, 0, 0), P(i, 0, h), wood, 3); seg(P(0, i, 0), P(0, i, h), mix(wood, '#000', 0.25), 3); }
  seg(P(0, 0, 10), P(N, 0, 10), '#D9C79A', 1.2); seg(P(0, 0, 10), P(0, N, 10), '#B8A67A', 1.2);
  // mât avec vergue et voile roulée
  const b = P(0, 0, 0), t = P(0, 0, 90);
  seg(b, t, '#4A2F1B', 6); seg(b, t, '#7A5230', 2.4);
  const y1 = P(0, 0, 80), y2 = P(0, 0, 38);
  seg([y1[0] - 62, y1[1] + 10], [y1[0] + 62, y1[1] - 10], '#4A2F1B', 4);
  poly([[y1[0] - 58, y1[1] + 10], [y1[0] + 58, y1[1] - 10], [y1[0] + 50 + Math.sin(T * 1.4) * 3, y2[1] - 12], [y1[0] - 50 + Math.sin(T * 1.4 + 1) * 3, y2[1] + 8]], 'rgba(244,233,207,0.93)', '#B8A67A', 1.2);
  const fx = y1[0], fy = (y1[1] + y2[1]) / 2 - 2; disc([fx, fy], 6, 6, '#14141C'); ctx.fillStyle = '#F4E9CF'; ctx.fillRect(fx - 3, fy - 2, 2, 2); ctx.fillRect(fx + 1, fy - 2, 2, 2); ctx.fillRect(fx - 2, fy + 2, 4, 1.5);
  seg(P(0, 0, 90), P(N, 0, 22), 'rgba(217,199,154,0.7)', 1); seg(P(0, 0, 90), P(0, N, 22), 'rgba(217,199,154,0.7)', 1);
  // lanternes aux poteaux
  [3, 6].forEach(function (i, k) { const l = P(i, 0, h + 10); seg(P(i, 0, h), l, '#3A2812', 1.4); glowAt(l[0], l[1], 20, '#FFC25A', 0.45 + 0.1 * Math.sin(T * 6 + k)); disc(l, 3, 3.6, '#FFE2A0', '#3A2812', 1); });
}
function edge(T, ph) {
  if (ph !== 'over') return;
  for (let r = 0; r < 3; r++) { seg(P(0, N, -r * 4.5 - 2), P(N, N, -r * 4.5 - 2), 'rgba(0,0,0,0.35)', 0.9); seg(P(N, N, -r * 4.5 - 2), P(N, 0, -r * 4.5 - 2), 'rgba(0,0,0,0.4)', 0.9); }
  [2.5, 6].forEach(function (u) { const p = P(u, N, -7); disc(p, 4, 2.4, '#1A1008', '#C9A36B', 1.4); const q = P(N, u, -7); disc(q, 4, 2.4, '#120A04', '#C9A36B', 1.4); });
  ctx.strokeStyle = 'rgba(235,250,255,0.85)'; ctx.lineWidth = 2;
  ctx.beginPath(); for (let i = 0; i <= 36; i++) { const u = i / 36 * N, p = P(u, N, -14 + Math.sin(i * 1.1 + T * 3) * 1.6); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke();
  ctx.beginPath(); for (let i = 0; i <= 36; i++) { const u = i / 36 * N, p = P(N, N - u, -14 + Math.sin(i * 1.1 + T * 3 + 2) * 1.6); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke();
}
const deco = {
  plan: function (s, T, live, g) {     // table des cartes : carte au trésor + pavillon
    lrect(s, 0.15, s.w - 0.15, 7, s.h - 5, '#EBD9A6', '#6B4526', 1.4);
    ctx.setLineDash([2, 2]); ctx.strokeStyle = '#8A2E1A'; ctx.lineWidth = 1; ctx.beginPath(); const a = lt(s, 0.35, 14), b = lt(s, 0.9, 24), c = lt(s, 1.3, 16), d = lt(s, 1.65, 30); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke(); ctx.setLineDash([]);
    seg([d[0] - 3, d[1] - 3], [d[0] + 3, d[1] + 3], '#B5251A', 2); seg([d[0] + 3, d[1] - 3], [d[0] - 3, d[1] + 3], '#B5251A', 2);
    const m = tp(s, 0.5, 0.5); seg(m, [m[0], m[1] - 24], '#3A2812', 2);
    poly([[m[0], m[1] - 24], [m[0] + 14, m[1] - 20 + Math.sin(T * 4) * 2], [m[0] + 12, m[1] - 12 + Math.sin(T * 4 + 1) * 2], [m[0], m[1] - 10]], '#14141C'); const sk = [m[0] + 6, m[1] - 17 + Math.sin(T * 4) * 1]; disc(sk, 2.2, 2.2, '#F4E9CF');
  },
  library: function (s, T, live, g) {  // cabine du capitaine : journaux + hublot
    for (let sh = 0; sh < 2; sh++) { const z = 8 + sh * 17; lline(s, 0.05, s.w * 0.6, z, '#2B1A0A', 2); for (let k = 0; k < 4; k++) { const u = 0.12 + k * 0.28; lrect(s, u, u + 0.2, z, z + 12, ['#7A2A1F', '#2A4A6B', '#6B5A1F', '#3A5A3A'][(k + sh) % 4]); } }
    const h = lt(s, s.w - 0.6, 30); disc(h, 9, 9, '#C9A36B'); disc(h, 6.5, 6.5, live ? '#BFF0FF' : '#5FA8C8'); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(h[0] - 1, h[1] - 1, 3.5, Math.PI, Math.PI * 1.6); ctx.stroke();
    const l = tp(s, 0.5, 0.5); seg(l, [l[0], l[1] - 6], '#3A2812', 1.6); glowAt(l[0], l[1] - 10, 18, '#FFC25A', 0.5); disc([l[0], l[1] - 9], 3, 3.6, '#FFE2A0', '#3A2812', 1);
  },
  bench: function (s, T, live, g) {     // atelier du charpentier
    for (let k = 0; k < 4; k++) box(s.x + 0.2, s.y + 0.2 + k * 0.01, 1.1, 0.35, 2, ['#B98042', '#A56B38', '#C48A4C', '#9A6232'][k], s.h + k * 2);
    const sw = live ? Math.sin(T * 10) * 4 : 0, p = tp(s, 0.7, 0.62, 2);
    seg([p[0] - 8 + sw, p[1] - 3], [p[0] + 8 + sw, p[1] - 3], '#C9D1D8', 2.4); poly([[p[0] - 8 + sw, p[1] - 3], [p[0] + 8 + sw, p[1] - 3], [p[0] + 8 + sw, p[1] - 1]], '#9AA3AB'); seg([p[0] + 8 + sw, p[1] - 3], [p[0] + 12 + sw, p[1] - 8], '#6B4526', 3);
    if (live) for (let k = 0; k < 3; k++) { ctx.fillStyle = '#E8C68A'; ctx.globalAlpha = 0.7; ctx.fillRect(p[0] + Math.sin(T * 8 + k) * 9, p[1] + 2 + ((T * 20 + k * 5) % 8), 1.6, 1.6); } ctx.globalAlpha = 1;
    const bpos = tp(s, 0.2, 0.85); cyl(bpos, 6, 10, '#8A5A2A');
  },
  terminal: function (s, T, live, g) {  // barre du navire
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 3, '#5A3A1E', '#2B1A0A', 1);
    const c = lt(s, s.w / 2, s.h - 14), R = 11, a0 = live ? T * 2.6 : 0.4;
    disc(c, R + 2, R + 2, null, '#C9A36B', 2.4); for (let i = 0; i < 8; i++) { const a = a0 + i * Math.PI / 4; seg(c, [c[0] + Math.cos(a) * (R + 5), c[1] + Math.sin(a) * (R + 5)], '#8A5A2A', 2); disc([c[0] + Math.cos(a) * (R + 5), c[1] + Math.sin(a) * (R + 5)], 1.8, 1.8, '#C9A36B'); }
    disc(c, 3, 3, '#C9A36B');
    const b = tp(s, 0.5, 0.5); cyl(b, 5, 7, '#C9A36B'); disc([b[0], b[1] - 8], 4, 2, '#E8F4FF'); const na = live ? T * 3 : 0.7; seg([b[0], b[1] - 8], [b[0] + Math.cos(na) * 3.4, b[1] - 8 + Math.sin(na) * 1.6], '#B5251A', 1.4);
  },
  tests: function (s, T, live, g) {     // canon d'essai
    const c = tp(s, 0.4, 0.5, 4); ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(-0.28);
    ctx.fillStyle = '#2A2E34'; rr(-16, -5, 32, 10, 4); ctx.fill(); ctx.fillStyle = '#41464E'; ctx.fillRect(-16, -5, 32, 3); ctx.fillStyle = '#1A1D22'; ctx.fillRect(12, -6, 5, 12); ctx.restore();
    disc([c[0] - 12, c[1] + 5], 6, 6, '#6B4526', '#2B1A0A', 1.2); disc([c[0] - 12, c[1] + 5], 2, 2, '#C9A36B');
    if (live && Math.sin(T * 7) > 0.85) { const m = [c[0] + 16, c[1] - 9]; glowAt(m[0], m[1], 20, '#FFC25A', 0.9); disc(m, 4, 4, '#FFF0B0'); }
    [[0, 0], [1, 0], [0.5, -1]].forEach(function (q) { const p = tp(s, 0.85, 0.5); disc([p[0] + q[0] * 5.5 - 3, p[1] + q[1] * 4.6], 2.8, 2.8, '#22262C', '#000', 0.8); });
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#8A7A5A'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.18, 0.5, 12); seg(tp(s, 0.18, 0.5), p, '#3A2812', 2); if (lamp || live) glowAt(p[0], p[1] - 2, 24, col, 0.65); disc([p[0], p[1] - 2], 4.2, 5, col, '#3A2812', 1.2);
  },
  dock: function (s, T, live, g) {      // passerelle
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? '#8A5A2A' : '#9A6A36', '#3A2812', 0.8); }
    [0.1, s.d - 0.1].forEach(function (yy, i) { const b = P(s.x + 0.15, s.y + yy, s.h); seg(b, [b[0], b[1] - 14], '#3A2812', 3); });
    seg(P(s.x + 0.15, s.y + 0.1, s.h + 12), P(s.x + 0.15, s.y + s.d - 0.1, s.h + 12), '#D9C79A', 1.4);
  }
};
function crate(x, y) { box(x + 0.1, y + 0.1, 0.8, 0.8, 13, '#A56B38', 0); box(x + 0.2, y + 0.2, 0.6, 0.6, 11, '#B98042', 13); seg(P(x + 0.1, y + 0.9, 6), P(x + 0.9, y + 0.9, 6), '#4A2F1B', 1.4); }
function balls(x, y) {
  cyl(P(x + 0.35, y + 0.35), 8, 16, '#6B4526'); seg(P(x + 0.35, y + 0.35, 8), P(x + 0.35, y + 0.35, 8), '#000', 1);
  [[0.62, 0.68, 0], [0.8, 0.62, 0], [0.7, 0.8, 0], [0.71, 0.7, 5]].forEach(function (b) { disc(P(x + b[0], y + b[1], b[2] + 3), 3.8, 3.8, '#22262C', '#000', 0.8); });
}
export default {
  name: 'Navire pirate', fonts: { d: 'Pirata One', b: 'Alegreya', df: 'serif', bf: 'serif' }, fs: { lab: 1.1, chip: 1.12 },
  ui: { bg: '#0D2332', surface: '#153649', ink: '#F4E9CF', ink2: '#A9BFC9', line: '#24526B', accent: '#F2B84B', onAccent: '#241503', rad: 3, cssRad: '4px', upper: 0, ls: '.04em', h1: 'clamp(30px,6.5vw,46px)', stageBg: '#0B1F30', glow: 0,
    bodyBg: 'linear-gradient(180deg, rgba(246,169,76,.12), transparent 40%)', stageBorder: '#C9A36B', stageShadow: '0 0 0 3px #0D2332, 0 0 0 4px #7A5A2E, 0 12px 30px rgba(0,0,0,.45)' },
  pal: { floorA: '#9A6B3F', floorB: '#8B5E34', slab: '#5A3B22', line: '#6B4526', ink: '#F4E9CF', ink2: '#A9BFC9', surface: '#153649', hat: '#F2B84B', skin: '#E8BE98', ok: '#6FD06A', bad: '#F0583F', warn: '#F2B84B', glow: '#F2B84B',
    st: { plan: '#C0392B', library: '#2F8FA0', bench: '#E0902A', terminal: '#9B6BD0', tests: '#5CAE45', dock: '#C9A36B' }, ag: ['#E0523A', '#3FA0D8', '#9B5DC9', '#E3B83A', '#E36AA0'] },
  floor: { kind: 'planks', pad: 'rug', thick: 18, lane: '#F2D27A', entry: ['#F2D27A', '#4A2F1B'], halo: 0.32 },
  base: { k: 0.55, c: '#4A2F1B' }, vig: 0.28, vigCol: '#00101C', spark: '#FFD27A',
  txt: {
    title: 'Le Navire des Agents', arrive: 'ABORDAGE', noun: 'pirate',
    sub: "Chaque agent IA est un pirate de l'équipage. Il se rend au poste du navire qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un poste ou un pirate pour comprendre.",
    aria: "Pont de navire pirate isométrique : des pirates représentent des agents IA et se déplacent entre les postes.",
    zones: {
      plan: ['CARTES', 'Table des cartes', "L'agent trace sa route : il met à jour sa liste de tâches ou confie une mission à un sous-agent (un matelot)."],
      library: ['JOURNAL', 'Cabine du capitaine', "L'agent consulte les journaux de bord : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['CHARPENTE', 'Atelier du charpentier', "L'agent modifie ou crée des fichiers. C'est ici que le code est scié, cloué et réparé."],
      terminal: ['BARRE', 'Barre du navire', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. Il tient la barre."],
      tests: ['CANON', "Canon d'essai", "L'agent lance les tests en tirant au canon. La lanterne devient verte si les tests réussissent, rouge s'ils échouent."],
      dock: ['PASSERELLE', 'Passerelle', "Les agents qui ont fini leur mission débarquent par la passerelle."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: crate, b: balls }, tall: 36,
  back: function (f, K, bob) { ctx.fillStyle = '#6B4526'; ctx.fillRect(f[0] + 4 * K, f[1] - 14 * K - bob, 1.6 * K, 11 * K); },
  torso: function (f, K, bob) {
    ctx.fillStyle = '#3A2812'; ctx.fillRect(f[0] - 6 * K, f[1] - 9 * K - bob, 12 * K, 2 * K); ctx.fillStyle = '#F2B84B'; ctx.fillRect(f[0] - 1.2 * K, f[1] - 9.2 * K - bob, 2.4 * K, 2.4 * K);
    poly([[f[0] - 6 * K, f[1] - 19 * K - bob], [f[0] - 3 * K, f[1] - 19 * K - bob], [f[0] + 6 * K, f[1] - 10 * K - bob], [f[0] + 3 * K, f[1] - 10 * K - bob]], 'rgba(176,36,24,0.92)');
  },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob;
    ctx.fillStyle = '#B02418'; ctx.fillRect(f[0] - 5.4 * K, y - 1.2 * K, 10.8 * K, 2.6 * K);
    poly([[f[0] - 8 * K, y - 1 * K], [f[0], y - 9 * K], [f[0] + 8 * K, y - 1 * K], [f[0], y - 3.4 * K]], '#17171F', '#C9A227', 0.9);
    disc([f[0], y - 4.6 * K], 1.3 * K, 1.3 * K, '#F4E9CF');
    ctx.fillStyle = '#111'; disc([f[0] + 2 * K, y + 1.5 * K + 0.6 * K], 1.7 * K, 1.7 * K, '#111'); seg([f[0] - 4 * K, y - 0.6 * K], [f[0] + 3 * K, y + 1.8 * K], '#111', 0.8 * K);
  }
};
