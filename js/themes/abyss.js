// Thème « Abysses » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { REDUCED } from '../config.js';
import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, glowAt, hsh, lrect, lt, poly, rgba, seg, tp, vgrad, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

let FISH = null;
function bg(T) {
  vgrad(0, H0, [[0, '#06385A'], [0.4, '#042A46'], [1, '#010A14']]);
  // rayons de lumière
  for (let i = 0; i < 6; i++) { const x = 40 + i * 120 + Math.sin(T * 0.3 + i) * 20, w = 36 + (i % 3) * 14; const g = ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, 'rgba(120,220,255,0.16)'); g.addColorStop(1, 'rgba(120,220,255,0)'); ctx.fillStyle = g; poly([[x, 0], [x + w, 0], [x + w + 70, 300], [x - 60, 300]], g); }
  // baleine lointaine
  const wx = ((T * 6) % (W0 + 360)) - 180, wy = 110 + Math.sin(T * 0.3) * 6; ctx.fillStyle = 'rgba(2,14,28,0.85)'; ctx.beginPath(); ctx.ellipse(wx, wy, 90, 20, 0, 0, 6.283); ctx.fill(); poly([[wx - 84, wy], [wx - 120, wy - 22 + Math.sin(T * 1.5) * 4], [wx - 110, wy + 2], [wx - 118, wy + 22 + Math.sin(T * 1.5) * 4]], 'rgba(2,14,28,0.85)'); poly([[wx + 10, wy + 12], [wx + 30, wy + 34], [wx + 36, wy + 12]], 'rgba(2,14,28,0.85)');
  // bancs de poissons
  if (!FISH) { FISH = []; for (let i = 0; i < 22; i++) FISH.push({ g: i % 2, ox: hsh(i, 1) * 90, oy: hsh(i, 2) * 40, sp: 0.8 + hsh(i, 3) * 0.4, ph: hsh(i, 4) * 6 }); }
  FISH.forEach(function (f) { const dir = f.g ? -1 : 1, base = f.g ? 230 : 160, x = (((T * 18 * f.sp * dir) + f.ox + f.g * 400) % (W0 + 100) + (W0 + 100)) % (W0 + 100) - 50, y = base + f.oy + Math.sin(T * 2 + f.ph) * 4; ctx.fillStyle = f.g ? 'rgba(255,170,90,0.7)' : 'rgba(150,230,255,0.6)'; poly([[x, y], [x - 5 * dir, y - 2.4], [x - 8 * dir, y], [x - 5 * dir, y + 2.4]], ctx.fillStyle); poly([[x - 8 * dir, y], [x - 11 * dir, y - 2.6], [x - 11 * dir, y + 2.6]], ctx.fillStyle); });
  // méduses
  [[70, 130, 0], [W0 - 90, 210, 2]].forEach(function (m) { const y = m[1] + Math.sin(T * 0.8 + m[2]) * 12, pu = 1 + Math.sin(T * 2.4 + m[2]) * 0.12; glowAt(m[0], y, 36, '#B58CFF', 0.35); ctx.beginPath(); ctx.ellipse(m[0], y, 11 * pu, 8 / pu, 0, Math.PI, 0); ctx.fillStyle = 'rgba(200,160,255,0.55)'; ctx.fill(); for (let k = -2; k <= 2; k++) { ctx.strokeStyle = 'rgba(200,160,255,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(m[0] + k * 4, y); ctx.quadraticCurveTo(m[0] + k * 4 + Math.sin(T * 2 + k) * 3, y + 10, m[0] + k * 4, y + 20); ctx.stroke(); } });
  // fond marin
  ctx.fillStyle = '#041A26'; ctx.beginPath(); ctx.moveTo(0, 340); ctx.quadraticCurveTo(90, 300, 180, 345); ctx.lineTo(180, H0); ctx.lineTo(0, H0); ctx.fill(); ctx.beginPath(); ctx.moveTo(W0, 330); ctx.quadraticCurveTo(W0 - 100, 290, W0 - 200, 350); ctx.lineTo(W0 - 200, H0); ctx.lineTo(W0, H0); ctx.fill();
  [[30, 350, '#E0558A'], [W0 - 40, 335, '#FF8A5C'], [70, 372, '#B58CFF']].forEach(function (c, i) { for (let k = -2; k <= 2; k++) { ctx.strokeStyle = c[2]; ctx.globalAlpha = 0.55; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.quadraticCurveTo(c[0] + k * 6 + Math.sin(T + k + i) * 3, c[1] - 12, c[0] + k * 9, c[1] - 24 - Math.abs(k) * 2); ctx.stroke(); } ctx.globalAlpha = 1; glowAt(c[0], c[1] - 14, 22, c[2], 0.18); });
}
function fx(T) {
  for (let i = 0; i < 26; i++) { const ph = (T * (0.05 + (i % 5) * 0.012) + hsh(i, 9)) % 1, x = hsh(i, 8) * W0 + Math.sin(T + i) * 6, y = H0 + 10 - ph * (H0 + 30), r = 1.2 + hsh(i, 7) * 2.6; ctx.globalAlpha = 0.5; ctx.strokeStyle = 'rgba(190,240,255,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x - r * 0.4, y - r * 0.5, 1, 1); }
  ctx.globalAlpha = 1;
}
function walls(T) {
  const z = 20;
  poly(wq(0, 0, N, 0, 0, z), 'rgba(80,220,255,0.05)', 'rgba(47,224,200,0.4)', 1); poly(wq(0, 0, 0, N, 0, z), 'rgba(80,220,255,0.05)', 'rgba(47,224,200,0.4)', 1);
  seg(P(0, 0, z), P(N, 0, z), '#4A6A78', 5); seg(P(0, 0, z), P(N, 0, z), '#8FB8C6', 1.8); seg(P(0, 0, z), P(0, N, z), '#3A5664', 5); seg(P(0, 0, z), P(0, N, z), '#7AA2B0', 1.8);
  for (let i = 0; i <= 3; i++) [[i * 3, 0], [0, i * 3]].forEach(function (c, k) { const b = P(c[0], c[1], 0), t = P(c[0], c[1], z + 14); seg(b, t, '#4A6A78', 4); seg(b, t, '#8FB8C6', 1.4); const on = Math.sin(T * 2.4 + i + k) > -0.3; glowAt(t[0], t[1], on ? 16 : 8, '#2FE0C8', on ? 0.8 : 0.3); disc(t, 3, 3, '#CFFFF4'); });
}
function edge(T, ph) {
  if (ph === 'under') { const b = P(N / 2, N, -16); for (let k = 0; k < 5; k++) { const pp = (T * 0.3 + k / 5) % 1; ctx.globalAlpha = 1 - pp; disc([b[0] + Math.sin(k * 3) * 30, b[1] + pp * 26], 2.4 + k % 3, 2.4 + k % 3, 'rgba(190,240,255,0.6)'); } ctx.globalAlpha = 1; return; }
  seg(P(0, N, 0), P(N, N, 0), '#2FE0C8', 2); seg(P(N, N, 0), P(N, 0, 0), '#2FE0C8', 2);
  for (let i = 0; i < N; i++) { const p = P(i + 0.5, N, -7), q = P(N, i + 0.5, -7); [p, q].forEach(function (c, k) { disc(c, 3.6, 2.2, '#0A1A24', '#8FB8C6', 1.2); const on = Math.sin(T * 1.6 + i + k) > -0.6; if (on) { glowAt(c[0], c[1], 9, '#7FE8FF', 0.5); disc(c, 2.2, 1.3, '#BFF3FF'); } }); }
  for (let r = 0; r < 2; r++) for (let i = 0; i < N * 3; i++) { const u = i / 3 + 0.1, p = P(u, N, -2.6 - r * 8), q = P(N, u, -2.6 - r * 8); ctx.fillStyle = 'rgba(140,180,196,0.55)'; ctx.fillRect(p[0], p[1], 1.4, 1.4); ctx.fillRect(q[0], q[1], 1.4, 1.4); }
}
function dial(c, r, ang, col) { disc(c, r, r, '#06141C', '#8FB8C6', 1.6); for (let i = 0; i < 8; i++) { const a = Math.PI * 0.8 + i * Math.PI * 1.4 / 7; seg([c[0] + Math.cos(a) * (r - 1.5), c[1] + Math.sin(a) * (r - 1.5)], [c[0] + Math.cos(a) * (r - 3.2), c[1] + Math.sin(a) * (r - 3.2)], '#8FB8C6', 0.8); } seg(c, [c[0] + Math.cos(ang) * (r - 2), c[1] + Math.sin(ang) * (r - 2)], col, 1.6); disc(c, 1.2, 1.2, col); }
const deco = {
  plan: function (s, T, live, g) {   // sonar
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 4, '#04121A', 'rgba(63,169,255,0.9)', 1.2);
    const c = lt(s, s.w / 2, s.h / 2 + 2), r = 14; disc(c, r, r, '#031018', 'rgba(63,169,255,0.9)', 1.4); disc(c, r * 0.6, r * 0.6, null, 'rgba(63,169,255,0.5)', 1); seg([c[0] - r, c[1]], [c[0] + r, c[1]], 'rgba(63,169,255,0.4)', 0.8); seg([c[0], c[1] - r], [c[0], c[1] + r], 'rgba(63,169,255,0.4)', 0.8);
    const a = T * (live ? 4 : 1.6); for (let k = 0; k < 8; k++) { ctx.strokeStyle = rgba('#6CC8FF', 0.5 * (1 - k / 8)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.cos(a - k * 0.08) * r, c[1] + Math.sin(a - k * 0.08) * r); ctx.stroke(); } seg(c, [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r], '#CFEFFF', 1.4);
    [[0.4, 0.2], [-0.3, -0.5]].forEach(function (b, i) { const al = 0.4 + 0.6 * Math.max(0, Math.sin(T * 2 + i * 2)); disc([c[0] + b[0] * r, c[1] + b[1] * r], 1.6, 1.6, rgba('#FF6A5A', al)); });
    const d = tp(s, 0.5, 0.5); seg(d, [d[0], d[1] - 10], '#8FB8C6', 2); disc([d[0], d[1] - 12], 6, 3, '#C5DCE4', '#4A6A78', 1);
  },
  library: function (s, T, live, g) {   // cuves d'échantillons
    for (let k = 0; k < 6; k++) { const u = 0.18 + k * 0.4, col = ['#2FE0C8', '#7FE8FF', '#FFC24A', '#B58CFF', '#3CE0A0', '#FF8A7A'][k]; lrect(s, u, u + 0.28, 8, s.h - 6, 'rgba(190,240,255,0.1)', '#8FB8C6', 1); lrect(s, u + 0.02, u + 0.26, 8, 14 + ((k * 7) % 22), rgba(col, 0.5)); const c = lt(s, u + 0.14, 20); glowAt(c[0], c[1], 14, col, 0.28);
      for (let b = 0; b < 3; b++) { const ph = (T * (live ? 1.2 : 0.5) + b / 3 + k * 0.2) % 1, q = lt(s, u + 0.08 + b * 0.06, 10 + ph * (s.h - 22)); ctx.globalAlpha = 1 - ph; disc(q, 1.4, 1.4, 'rgba(255,255,255,0.8)'); } ctx.globalAlpha = 1; }
    const a = tp(s, 0.5, 0.5); glowAt(a[0], a[1], 18, '#2FE0C8', 0.35);
  },
  bench: function (s, T, live, g) {   // soudure sous-marine
    box(s.x + 0.2, s.y + 0.7, 1.0, 0.5, 3, '#5A6A74', s.h); const w = tp(s, 0.4, 0.55, 3);
    const j1 = tp(s, 0.7, 0.35, 0), j2 = [j1[0] - 6, j1[1] - 26], j3 = [w[0] + 2, w[1] - 6 + Math.sin(T * 8) * (live ? 1.5 : 0)];
    seg(j1, j2, '#8FA3AD', 4); seg(j2, j3, '#8FA3AD', 3.4); disc(j2, 3, 3, '#FFB347'); disc(j1, 3.4, 2, '#4A5A64');
    if (live) { const fl = 0.6 + 0.4 * Math.abs(Math.sin(T * 40)); glowAt(j3[0], j3[1], 24 * fl, '#BFE6FF', 0.85); disc(j3, 3 * fl, 3 * fl, '#FFFFFF'); for (let k = 0; k < 5; k++) { const a = T * 22 + k * 2; ctx.fillStyle = '#FFE08A'; ctx.fillRect(j3[0] + Math.cos(a) * 8, j3[1] + Math.sin(a) * 4, 1.6, 1.6); } }
    for (let b = 0; b < 4; b++) { const ph = (T * 0.4 + b / 4) % 1; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = 'rgba(190,240,255,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(j3[0] + Math.sin(b * 3 + ph * 5) * 5, j3[1] - 6 - ph * 28, 1.6 + b % 2, 0, 6.283); ctx.stroke(); } ctx.globalAlpha = 1;
  },
  terminal: function (s, T, live, g) {   // périscope + jauge
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 4, '#08202E', 'rgba(181,140,255,0.9)', 1.2);
    dial(lt(s, s.w / 2, s.h - 14), 8, Math.PI * 0.8 + (0.5 + 0.45 * Math.sin(T * (live ? 3 : 0.8))) * Math.PI * 1.4, '#FF6A5A');
    for (let k = 0; k < 3; k++) { const q = lt(s, 0.2 + k * 0.28, 11); glowAt(q[0], q[1], 5, [C.ok, C.warn, C.bad][k], Math.sin(T * 3 + k * 2) > -0.3 ? 0.9 : 0.3); }
    const b = tp(s, 0.5, 0.5), sw = Math.sin(T * 0.7) * 3; seg(b, [b[0], b[1] - 26], '#9AB0BA', 4); seg([b[0], b[1] - 26], [b[0] + 7 + sw, b[1] - 28], '#9AB0BA', 4); disc([b[0] + 9 + sw, b[1] - 28], 2.6, 3.2, '#BFF3FF', '#4A6A78', 1); glowAt(b[0] + 9 + sw, b[1] - 28, 12, '#7FE8FF', 0.5);
  },
  tests: function (s, T, live, g) {   // caisson de pression
    const c = lt(s, 0.7, 8), r = 9; disc(c, r, r, '#1A3A48', '#8FB8C6', 2); disc(c, r - 3, r - 3, '#08202E'); for (let i = 0; i < 6; i++) { const a = (live ? T * 2 : 0.3) + i * Math.PI / 3; seg(c, [c[0] + Math.cos(a) * (r - 3), c[1] + Math.sin(a) * (r - 3)], '#8FB8C6', 1.2); }
    dial(lt(s, 1.5, 8), 5.5, Math.PI * 0.8 + (0.4 + 0.5 * Math.abs(Math.sin(T * (live ? 4 : 1)))) * Math.PI * 1.4, '#FFC24A');
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#5A7A88'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.5, 0.5, 9); seg(tp(s, 0.5, 0.5), p, '#8FA3AD', 3); if (lamp || live) glowAt(p[0], p[1] - 3, 30, col, 0.65); disc([p[0], p[1] - 3], 6, 6, col, '#DDF4F7', 1);
    const t = tp(s, 0.15, 0.5); disc(t, 8, 4, 'rgba(190,240,255,0.18)', '#8FB8C6', 1); ctx.fillStyle = 'rgba(190,240,255,0.14)'; ctx.fillRect(t[0] - 8, t[1] - 12, 16, 12); disc([t[0], t[1] - 12], 8, 4, 'rgba(190,240,255,0.25)', '#8FB8C6', 1);
  },
  dock: function (s, T, live, g) {   // sas
    const c = tp(s, 0.5, 0.5, 0); disc(c, 17, 8.5, '#0A1A24', '#8FB8C6', 2); disc(c, 12, 6, '#143444', '#4A6A78', 1.4); for (let k = 0; k < 6; k++) { const a = (live ? T * 1.5 : 0) + k * Math.PI / 3; seg(c, [c[0] + Math.cos(a) * 12, c[1] + Math.sin(a) * 6], '#8FB8C6', 1.4); }
    disc(c, 3, 1.6, '#FFC24A');
    [0.15, s.d - 0.15].forEach(function (yy, i) { const b = P(s.x + 0.5, s.y + yy, s.h), t = [b[0], b[1] - 14]; seg(b, t, '#8FA3AD', 3); const on = Math.sin(T * 5 + i * 3) > 0; glowAt(t[0], t[1], on ? 16 : 7, '#FFC24A', on ? 0.9 : 0.3); disc(t, 3, 3, on ? '#FFE9A8' : '#7A5A10'); });
    for (let b = 0; b < 4; b++) { const ph = (T * 0.5 + b / 4) % 1; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = 'rgba(190,240,255,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(c[0] + Math.sin(b * 2 + ph * 4) * 8, c[1] - ph * 26, 1.6 + b % 2, 0, 6.283); ctx.stroke(); } ctx.globalAlpha = 1;
  }
};
function tank(x, y) { [[0.32, 0.4, '#2FE0C8'], [0.66, 0.66, '#FFC24A']].forEach(function (b) { const p = P(x + b[0], y + b[1]); cyl(p, 5.6, 22, '#6A7E88'); ctx.fillStyle = b[2]; ctx.fillRect(p[0] - 5.6, p[1] - 14, 11.2, 3); disc([p[0], p[1] - 22], 5.6, 2.8, '#9AB0BA'); }); }
function coral(x, y, T) { const p = P(x + 0.5, y + 0.55); [['#E0558A', -5, 22], ['#FF8A5C', 0, 28], ['#B58CFF', 5, 20]].forEach(function (c, i) { ctx.strokeStyle = c[0]; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p[0] + c[1], p[1]); ctx.quadraticCurveTo(p[0] + c[1] + Math.sin(T * 1.4 + i) * 2, p[1] - c[2] * 0.6, p[0] + c[1] * 1.6, p[1] - c[2]); ctx.stroke(); glowAt(p[0] + c[1] * 1.6, p[1] - c[2], 9, c[0], 0.6); }); disc(p, 9, 4.4, '#2A3A44'); }
export default {
  name: 'Abysses', fonts: { d: 'Exo 2', b: 'Exo 2', df: 'sans-serif', bf: 'sans-serif' }, fs: { lab: 0.95, chip: 0.98 },
  ui: { bg: '#010A12', surface: '#06202E', ink: '#DDF4F7', ink2: '#7FB2BD', line: '#0F3A4C', accent: '#2FE0C8', onAccent: '#021A1A', rad: 8, cssRad: '10px', upper: 1, ls: '.08em', glow: 1, h1: 'clamp(24px,5.5vw,38px)', stageBg: '#010A14',
    bodyBg: 'radial-gradient(ellipse at 50% -10%, rgba(47,224,200,.16), transparent 60%)', stageBorder: 'rgba(47,224,200,.6)', stageShadow: '0 0 34px rgba(47,224,200,.22), inset 0 0 60px rgba(0,0,0,.6)' },
  pal: { floorA: '#0C2230', floorB: '#0A1B28', slab: '#143445', line: '#14465A', ink: '#DDF4F7', ink2: '#7FB2BD', surface: '#06202E', hat: '#FFC24A', skin: '#E8BE98', ok: '#3CE0A0', bad: '#FF6A5A', warn: '#FFC24A', glow: '#2FE0C8',
    st: { plan: '#3FA9FF', library: '#2FE0C8', bench: '#FFB347', terminal: '#B58CFF', tests: '#5CE07A', dock: '#7FB2BD' }, ag: ['#FF7A5A', '#4DB2FF', '#C77DFF', '#FFD23F', '#FF6FB0'] },
  floor: { kind: 'checker', inset: 1, insetA: 0.3, insetCol: '#2FE0C8', grid: 0.18, gridCol: '#2FE0C8', pad: 'neon', thick: 16, lane: '#FFC24A', entry: ['#FFC24A', '#06141C'], halo: 0.42 },
  base: { k: 0.72, c: '#04121A', trim: 1 }, vig: 0.6, vigCol: '#000A14', fx: fx,
  txt: {
    title: 'Base des Abysses', arrive: 'AMARRAGE', noun: 'plongeur',
    sub: "Chaque agent IA est un scaphandrier de la base sous-marine. Il se rend au module qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un module ou un plongeur pour comprendre.",
    aria: "Base sous-marine isométrique au fond de l'océan : des plongeurs représentent des agents IA et se déplacent entre les modules.",
    zones: {
      plan: ['SONAR', 'Centre sonar', "L'agent repère sa route : il met à jour sa liste de tâches ou envoie une sonde (sous-agent) explorer une mission."],
      library: ['RELEVÉS', 'Relevés océaniques', "L'agent étudie les échantillons : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['SOUDURE', 'Atelier de soudure', "L'agent modifie ou crée des fichiers. C'est ici que le code est soudé sous pression."],
      terminal: ['PILOTAGE', 'Poste de pilotage', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. Le périscope surveille la surface."],
      tests: ['PRESSION', 'Caisson de pression', "L'agent lance les tests en caisson. Le témoin devient vert si les tests réussissent, rouge s'ils échouent."],
      dock: ['SAS', 'Sas de plongée', "Les agents qui ont fini leur mission sortent par le sas de plongée."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: tank, b: coral }, tall: 36,
  back: function (f, K, bob, col, T, mv) { ctx.fillStyle = '#6A7E88'; ctx.fillRect(f[0] - 9.4 * K, f[1] - 19 * K - bob, 3.8 * K, 11 * K); ctx.fillStyle = '#2FE0C8'; ctx.fillRect(f[0] - 9.4 * K, f[1] - 14 * K - bob, 3.8 * K, 1.6 * K); if (mv && !REDUCED) for (let b = 0; b < 2; b++) { ctx.strokeStyle = 'rgba(190,240,255,0.8)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(f[0] - 8 * K + Math.sin(T * 8 + b) * 2, f[1] - 24 * K - ((T * 20 + b * 6) % 14) - bob, 1.3, 0, 6.283); ctx.stroke(); } },
  torso: function (f, K, bob) { ctx.fillStyle = '#C9A24A'; ctx.fillRect(f[0] - 6 * K, f[1] - 19.5 * K - bob, 12 * K, 2.4 * K); ctx.fillRect(f[0] - 6 * K, f[1] - 9 * K - bob, 12 * K, 1.8 * K); ctx.fillStyle = '#7A5A1A'; ctx.fillRect(f[0] - 1.2 * K, f[1] - 9.2 * K - bob, 2.4 * K, 2.2 * K); },
  gear: function (f, K, bob) {
    const y = f[1] - 25 * K - bob;
    const g = ctx.createRadialGradient(f[0] - 3 * K, y - 3 * K, 1, f[0], y, 9 * K); g.addColorStop(0, '#F2D27A'); g.addColorStop(1, '#8A6A1F');
    ctx.beginPath(); ctx.arc(f[0], y, 8.4 * K, 0, 6.283); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#4A3408'; ctx.lineWidth = 1.2; ctx.stroke();
    disc([f[0], y], 6 * K, 6 * K, 'rgba(160,230,255,0.28)', '#4A3408', 1.4); ctx.beginPath(); ctx.arc(f[0] - 2 * K, y - 2.4 * K, 2.4 * K, Math.PI * 1.1, Math.PI * 1.7); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1; ctx.stroke();
    [[-7, -1], [7, -1], [0, -8]].forEach(function (r) { disc([f[0] + r[0] * K, y + r[1] * K], 0.9 * K, 0.9 * K, '#4A3408'); });
    ctx.fillStyle = '#8A6A1F'; ctx.fillRect(f[0] - 1.4 * K, y - 10.6 * K, 2.8 * K, 2.4 * K);
  }
};
