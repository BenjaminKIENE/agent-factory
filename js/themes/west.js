// Thème « Far West » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, TH, TW, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, flame, glowAt, hsh, lline, lrect, lt, poly, rr, seg, stars, tp, vgrad, winW, wpt, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

function cactus(x, y, h, c) { ctx.fillStyle = c; ctx.fillRect(x - 3, y - h, 6, h); ctx.fillRect(x - 12, y - h * 0.65, 4, h * 0.3); ctx.fillRect(x - 12, y - h * 0.65, 9, 3.4); ctx.fillRect(x + 8, y - h * 0.8, 4, h * 0.3); ctx.fillRect(x + 3, y - h * 0.8 + h * 0.3 - 3.4, 9, 3.4); }
function bg(T) {
  vgrad(0, 236, [[0, '#2A1A52'], [0.4, '#B8456E'], [0.8, '#F58A3A'], [1, '#FAC773']]);
  stars(50, 9, '#FFE9D0');
  glowAt(140, 236, 170, '#FFD27A', 0.55); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W0, 236); ctx.clip(); disc([140, 236], 54, 54, '#FFE7A0'); ctx.restore();
  [['#7A3A32', 0.95, 215, 50, 22], ['#5A2A2A', 1, 232, 40, 16]].forEach(function (L, li) { ctx.fillStyle = L[0]; for (let i = 0; i < 6; i++) { const x = i * 130 + li * 55 - 20, w = 70 + hsh(i, li) * 50, h = L[3] + hsh(i, li + 3) * 26; poly([[x, L[2] + 20], [x + 8, L[2] - h + 12], [x + w - 8, L[2] - h + 12], [x + w, L[2] + 20]], L[0]); ctx.fillRect(x + 6, L[2] - h + 8, w - 12, 5); } });
  vgrad(236, H0, [[0, '#C98A4A'], [0.5, '#9A6236'], [1, '#5A3820']]);
  cactus(60, 290, 40, '#2E5A34'); cactus(W0 - 70, 270, 52, '#2E5A34'); cactus(W0 - 30, 330, 34, '#244A2A'); cactus(34, 350, 30, '#244A2A');
  const tx = ((T * 26) % (W0 + 80)) - 40, ty = 360 + Math.abs(Math.sin(T * 5)) * -8; ctx.strokeStyle = '#7A5A30'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(tx, ty, 8, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.arc(tx, ty, 5, T * 6, T * 6 + 4); ctx.stroke(); ctx.beginPath(); ctx.arc(tx, ty, 3, 0, 5); ctx.stroke();
  for (let i = 0; i < 12; i++) { ctx.globalAlpha = 0.12; ctx.fillStyle = '#F5D9A0'; ctx.fillRect(((T * 18 + i * 60) % (W0 + 20)) - 10, 300 + hsh(i, 5) * 90, 18 + hsh(i, 6) * 20, 1.6); } ctx.globalAlpha = 1;
}
function walls(T) {
  // façade de saloon à droite
  const h = 66;
  poly(wq(0, 0, N, 0, 0, h), '#8A5A33'); for (let z = 6; z < h; z += 7) seg(wpt('R', 0, z), wpt('R', N, z), 'rgba(40,20,8,0.4)', 1);
  poly(wq(0, 0, N, 0, h - 5, h), '#5A3820'); poly(wq(0, 0, N, 0, 0, 5), '#5A3820');
  poly([wpt('R', 2.2, h), wpt('R', 6.4, h), wpt('R', 6.4, h + 24), wpt('R', 5.4, h + 30), wpt('R', 3.2, h + 30), wpt('R', 2.2, h + 24)], '#9A6438', '#3A2210', 1.4);
  ctx.save(); const o = wpt('R', 2.6, h + 17); ctx.translate(o[0], o[1]); ctx.transform(1, TH / TW, 0, 1, 0, 0); ctx.font = "400 13px 'Rye', serif"; ctx.fillStyle = '#F2D27A'; ctx.textAlign = 'left'; ctx.fillText('SALOON', 0, 0); ctx.restore();
  [0.5, 6.9].forEach(function (u) { winW('R', u, u + 1.1, 26, 52, '#F2B25A', '#3A2210', 1); const a = wpt('R', u - 0.3, 52), b = wpt('R', u, 52), c = wpt('R', u, 26), d = wpt('R', u - 0.3, 26); poly([a, b, c, d], '#4A6A3A', '#2A3A20', 1); const e = wpt('R', u + 1.1, 52), f = wpt('R', u + 1.4, 52), g2 = wpt('R', u + 1.4, 26), i2 = wpt('R', u + 1.1, 26); poly([e, f, g2, i2], '#4A6A3A', '#2A3A20', 1); });
  // portes battantes
  const swing = Math.sin(T * 1.5) * 0.12; [0, 1].forEach(function (i) { const u = 3.2 + i * 1.0, a = wpt('R', u, 36), b = wpt('R', u + 0.9 + swing * (i ? -1 : 1), 36), c = wpt('R', u + 0.9 + swing * (i ? -1 : 1), 6), d = wpt('R', u, 6); poly([a, b, c, d], '#7A4A26', '#2A1808', 1.2); for (let k = 0; k < 3; k++) seg(wpt('R', u + 0.1, 12 + k * 9), wpt('R', u + 0.8, 12 + k * 9), 'rgba(0,0,0,0.3)', 1); });
  // lanterne
  [1.8, 7.8].forEach(function (u, i) { const p = wpt('R', u, 62); seg(p, [p[0], p[1] - 8], '#2A1808', 1.4); glowAt(p[0], p[1] + 2, 20, '#FFB347', 0.5 + 0.08 * Math.sin(T * 5 + i)); disc(p, 3, 4, '#FFE0A0', '#2A1808', 1); });
  // clôture à gauche
  seg(P(0, 0, 18), P(0, N, 18), '#B98042', 3); seg(P(0, 0, 9), P(0, N, 9), '#A0693A', 3);
  for (let i = 0; i <= 9; i++) seg(P(0, i, 0), P(0, i, 22), '#7A4A26', 3.4);
}
function edge(T, ph) {
  if (ph !== 'over') return;
  for (let i = 0; i < N; i++) { const a = P(i, N, -2), b = P(i + 1, N, -2), c = P(i + 1, N, -14), d = P(i, N, -14); poly([a, b, c, d], i % 2 ? 'rgba(90,56,32,0.55)' : 'rgba(70,42,24,0.55)', 'rgba(0,0,0,0.3)', 0.8); const e = P(N, i, -2), f = P(N, i + 1, -2), g = P(N, i + 1, -14), h = P(N, i, -14); poly([e, f, g, h], i % 2 ? 'rgba(70,42,24,0.6)' : 'rgba(50,30,16,0.6)', 'rgba(0,0,0,0.3)', 0.8); }
  [0, 3, 6, 9].forEach(function (u) { const p = P(u, N, 0); seg(p, [p[0], p[1] - 8], '#5A3820', 3.4); });
}
function star(c, r, rot, fill, stroke) { const pts = []; for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5 - Math.PI / 2, rad = i % 2 ? r * 0.45 : r; pts.push([c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad * 0.9]); } poly(pts, fill, stroke, 0.8); }
const deco = {
  plan: function (s, T, live, g) {
    [0.15, 0.7, 1.25].forEach(function (u, i) {
      lrect(s, u, u + 0.45, 12, s.h - 6, '#EBD9A6', '#5A3820', 1); const f = lt(s, u + 0.225, s.h - 17); disc(f, 4, 4.6, '#C99A6A', '#5A3820', 0.8); lline(s, u + 0.06, u + 0.39, s.h - 11, '#7A2A1F', 1.6); lline(s, u + 0.08, u + 0.37, 16, '#8A7A5A', 1);
      const n = lt(s, u + 0.06, s.h - 6); ctx.fillStyle = '#444'; ctx.fillRect(n[0] - 1, n[1] - 1, 2, 2);
    });
    const c = tp(s, 0.5, 0.5, 12); star(c, 11, live ? T * 1.2 : 0, '#F2C230', '#8A6A10'); glowAt(c[0], c[1], 20, '#FFE08A', live ? 0.5 : 0.2); disc(c, 2.2, 2, '#8A6A10');
  },
  library: function (s, T, live, g) {
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 4, '#6A4426', '#2A1808', 1.4);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 8; k++) { const u = 0.18 + k * 0.28, z = 10 + r * 10; lrect(s, u, u + 0.22, z, z + 8, '#3A2210', '#8A5A33', 0.8); if ((r * 8 + k) % 3 === 0) lrect(s, u + 0.03, u + 0.19, z + 4, z + 9, '#EBD9A6'); }
    const l = tp(s, 0.5, 0.5); seg(l, [l[0], l[1] - 5], '#2A1808', 1.6); glowAt(l[0], l[1] - 10, 20, '#FFB347', 0.5); disc([l[0], l[1] - 9], 3, 4, '#FFE0A0', '#2A1808', 1);
  },
  bench: function (s, T, live, g) {
    const an = tp(s, 0.7, 0.55); poly([[an[0] - 11, an[1] - 4], [an[0] + 12, an[1] - 4], [an[0] + 7, an[1] - 8], [an[0] - 8, an[1] - 8]], '#6B7480', '#2A2E34', 1); ctx.fillStyle = '#4A5058'; ctx.fillRect(an[0] - 5, an[1] - 4, 10, 4);
    ctx.strokeStyle = '#9AA3AB'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(an[0], an[1] - 11, 3.6, Math.PI * 0.15, Math.PI * 0.85, true); ctx.stroke();
    box(s.x + 0.2, s.y + 0.4, 0.8, 0.8, 8, '#4A3A30', s.h); const co = tp(s, 0.28, 0.5, 8); disc(co, 10, 5, '#1A1210'); disc(co, 7, 3.6, live ? '#FF6A1A' : '#8A2E10'); flame(co, live ? 5.5 : 3, T, 3); glowAt(co[0], co[1], 26, '#FF7A1A', live ? 0.55 : 0.28);
    if (live) { const a = Math.abs(Math.sin(T * 6)); seg([an[0] + 2, an[1] - 8 - 10 * a], [an[0] + 10, an[1] - 14 - 10 * a], '#6B4A25', 2.4); ctx.fillStyle = '#5A606A'; ctx.fillRect(an[0] + 7, an[1] - 18 - 10 * a, 7, 4); }
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 3, '#6A4426', '#2A1808', 1);
    const k = lt(s, 0.5, 14); ctx.fillStyle = '#2A1808'; ctx.fillRect(k[0] - 8, k[1] - 2, 16, 4); ctx.fillStyle = '#C9A227'; ctx.fillRect(k[0] - 7, k[1] - 6 + (live && Math.sin(T * 14) > 0 ? 2 : 0), 10, 2); disc([k[0] + 5, k[1] - 5 + (live && Math.sin(T * 14) > 0 ? 2 : 0)], 2.4, 2, '#C9A227');
    const sd = lt(s, 0.5, 24); ctx.strokeStyle = 'rgba(250,230,180,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sd[0], sd[1], 5, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sd[0], sd[1]); ctx.lineTo(sd[0] + Math.cos(T * 2) * 4, sd[1] + Math.sin(T * 2) * 4); ctx.stroke();
    const a = tp(s, 0.5, 0.5); seg(a, [a[0], a[1] - 24], '#3A2210', 3); seg([a[0] - 12, a[1] - 20], [a[0] + 12, a[1] - 20], '#3A2210', 2.6);
    [-12, 12].forEach(function (dx, i) { disc([a[0] + dx, a[1] - 22], 2.2, 2.2, '#6EC8E0'); ctx.strokeStyle = 'rgba(30,20,10,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0] + dx, a[1] - 20); ctx.quadraticCurveTo(a[0] + dx * 2.6, a[1] - 14, a[0] + dx * 3.6, a[1] - 22); ctx.stroke(); });
    const on = live ? Math.sin(T * 14) > 0 : false; glowAt(a[0], a[1] - 26, on ? 14 : 6, '#FFB347', on ? 0.9 : 0.35);
  },
  tests: function (s, T, live, g) {
    seg(tp(s, 0.05, 0.75), tp(s, 0.7, 0.75), '#6A4426', 3);
    for (let i = 0; i < 4; i++) { const p = tp(s, 0.12 + i * 0.15, 0.75), gone = live && ((Math.floor(T * 2) + i) % 5 === 0); if (gone) { for (let k = 0; k < 4; k++) { ctx.fillStyle = '#7FD0A0'; ctx.fillRect(p[0] + Math.sin(k * 2 + T * 20) * 5, p[1] - 6 - ((T * 30 + k * 4) % 8), 1.6, 1.6); } continue; } ctx.fillStyle = 'rgba(80,190,130,0.85)'; rr(p[0] - 2.4, p[1] - 12, 4.8, 12, 1.6); ctx.fill(); ctx.fillStyle = 'rgba(80,190,130,0.85)'; ctx.fillRect(p[0] - 1, p[1] - 16, 2, 5); }
    const t = lt(s, 1.5, 9); disc(t, 8, 8, '#EBD9A6', '#5A3820', 1); disc(t, 5.4, 5.4, '#C0392B'); disc(t, 2.8, 2.8, '#EBD9A6'); disc(t, 1.2, 1.2, '#C0392B');
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#B8A070'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.85, 0.45, 12); seg(tp(s, 0.85, 0.45), p, '#2A1808', 2.6); if (lamp || live) glowAt(p[0], p[1], 26, col, 0.6); star(p, 6.4, 0, col, '#2A1808');
  },
  dock: function (s, T, live, g) {
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? '#7A5630' : '#8A6538', '#3A2812', 0.7); }
    box(s.x + 0.2, s.y + 0.55, 0.6, 0.9, 12, '#9A3A2A', s.h + 4); box(s.x + 0.2, s.y + 0.55, 0.6, 0.9, 3, '#C99A4A', s.h + 16);
    [[0.5, 0.25], [0.5, 1.75]].forEach(function (w, i) { const c = P(s.x + 1.0, s.y + w[1] + 0.0, s.h + 7), rot = live ? T * 4 : 0.5; disc(c, 8, 8, null, '#2A1808', 2); for (let k = 0; k < 6; k++) { const a = rot + k * Math.PI / 3; seg(c, [c[0] + Math.cos(a) * 8, c[1] + Math.sin(a) * 8], '#6A4426', 1.2); } });
    const h = P(s.x + 0.3, s.y + 0.3, s.h); ctx.fillStyle = '#D9B84F'; ctx.fillRect(h[0] - 5, h[1] - 7, 10, 7);
  }
};
function hay(x, y) { box(x + 0.12, y + 0.18, 0.76, 0.64, 12, '#D9B84F', 0); [4, 8].forEach(function (z) { seg(P(x + 0.12, y + 0.82, z), P(x + 0.88, y + 0.82, z), '#8A6A1F', 1.2); }); seg(P(x + 0.88, y + 0.82, 12), P(x + 0.88, y + 0.18, 12), '#8A6A1F', 1); }
function cact(x, y) { const p = P(x + 0.5, y + 0.55); cyl(p, 7, 6, '#9A5A32'); cactus(p[0], p[1] - 4, 26, '#3E7A44'); disc([p[0] + 1, p[1] - 28], 2.2, 2.2, '#E0558A'); }
export default {
  name: 'Far West', fonts: { d: 'Rye', b: 'Rokkitt', df: 'serif', bf: 'serif' }, fs: { lab: 0.82, chip: 1.1 },
  ui: { bg: '#241509', surface: '#34200F', ink: '#F6E7C8', ink2: '#C9A878', line: '#5A3A1E', accent: '#E8A33A', onAccent: '#2A1606', rad: 2, cssRad: '3px', upper: 0, ls: '.04em', h1: 'clamp(26px,5.8vw,40px)', stageBg: '#241509', glow: 0,
    bodyBg: 'linear-gradient(180deg, rgba(232,163,58,.14), transparent 45%)', stageBorder: '#A8793A', stageShadow: '0 0 0 3px #241509, 0 0 0 4px #7A5426, 0 12px 28px rgba(0,0,0,.5)' },
  pal: { floorA: '#B98A55', floorB: '#A87A48', slab: '#6B4A2A', line: '#7A5632', ink: '#F6E7C8', ink2: '#C9A878', surface: '#34200F', hat: '#E8A33A', skin: '#E8BE98', ok: '#7FCB5A', bad: '#E5553A', warn: '#F2B83A', glow: '#E8A33A',
    st: { plan: '#B5382F', library: '#6B8E4E', bench: '#E07B2A', terminal: '#4F86B8', tests: '#C9A227', dock: '#8A6A45' }, ag: ['#D8472B', '#3A86C8', '#8D5BC0', '#D9A62B', '#4FA36A'] },
  floor: { kind: 'planks', pad: 'rug', thick: 16, lane: '#F2D27A', entry: ['#F2D27A', '#4A2F1B'], halo: 0.3 },
  base: { k: 0.55, c: '#5A3A1E' }, vig: 0.3, vigCol: '#1A0A02', spark: '#FFB347',
  txt: {
    title: 'Far West des Agents', arrive: 'ENTRÉE', noun: 'cow-boy',
    sub: "Chaque agent IA est un cow-boy de la ville. Il se rend au bâtiment qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un bâtiment ou un cow-boy pour comprendre.",
    aria: "Ville du Far West isométrique : des cow-boys représentent des agents IA et se déplacent entre les bâtiments.",
    zones: {
      plan: ['SHÉRIF', 'Bureau du shérif', "L'agent organise sa journée : il met à jour sa liste de tâches (les avis de recherche) ou confie une mission à un adjoint (sous-agent)."],
      library: ['ARCHIVES', 'Archives du comté', "L'agent fouille les archives : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['FORGE', 'Forge du maréchal-ferrant', "L'agent modifie ou crée des fichiers. C'est ici que le code est forgé sur l'enclume."],
      terminal: ['TÉLÉGRAPHE', 'Télégraphe', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. Chaque commande est un message télégraphié."],
      tests: ['TIR', 'Stand de tir', "L'agent lance les tests : il tire sur les bouteilles. L'étoile devient verte si les tests réussissent, rouge s'ils échouent."],
      dock: ['DILIGENCE', 'Diligence', "Les agents qui ont fini leur mission montent dans la diligence pour quitter la ville."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: hay, b: cact }, tall: 35,
  boots: '#3A2210', pants: function () { return '#3E4F6B'; },
  torso: function (f, K, bob) { ctx.fillStyle = '#3A2414'; ctx.fillRect(f[0] - 6 * K, f[1] - 19.5 * K - bob, 3.4 * K, 12 * K); ctx.fillRect(f[0] + 2.6 * K, f[1] - 19.5 * K - bob, 3.4 * K, 12 * K); star([f[0] + 3.8 * K, f[1] - 15 * K - bob], 2.2 * K, 0, '#F2C230', null); },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob;
    poly([[f[0] - 4 * K, y + 5.6 * K], [f[0] + 4 * K, y + 5.6 * K], [f[0] + 3 * K, y + 8 * K], [f[0] - 3 * K, y + 8 * K]], '#C0392B');
    disc([f[0], y - 0.5 * K], 9.6 * K, 3 * K, '#8A5A2A', '#3A2412', 1); ctx.beginPath(); ctx.moveTo(f[0] - 5 * K, y - 1 * K); ctx.quadraticCurveTo(f[0] - 4.6 * K, y - 8 * K, f[0], y - 7 * K); ctx.quadraticCurveTo(f[0] + 4.6 * K, y - 8 * K, f[0] + 5 * K, y - 1 * K); ctx.closePath(); ctx.fillStyle = '#A06C38'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3A2412'; ctx.fillRect(f[0] - 5 * K, y - 2.6 * K, 10 * K, 1.6 * K);
  }
};
