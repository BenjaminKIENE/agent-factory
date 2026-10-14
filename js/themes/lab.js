// Thème « Laboratoire » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, flame, glowAt, hsh, lline, lrect, lt, poly, rgba, seg, tp, vgrad, wallPair, winW, wpt } from '../render/draw-kit.js';
import { app } from '../store.js';

function hexP(c, r, rot) { const p = []; for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; p.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } return p; }
function bg(T) {
  vgrad(0, H0, [[0, '#EAF6F5'], [1, '#D8EBEC']]);
  ctx.strokeStyle = 'rgba(15,163,163,0.09)'; ctx.lineWidth = 1;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 18; c++) { const x = c * 40 + (r % 2) * 20, y = r * 35; poly(hexP([x, y], 20, 0.52), null, 'rgba(15,163,163,0.09)', 1); }
  for (let i = 0; i < 7; i++) {
    const x = (hsh(i, 1) * W0 + T * (4 + i)) % (W0 + 60) - 30, y = 40 + hsh(i, 2) * 300 + Math.sin(T * 0.6 + i) * 8;
    ctx.globalAlpha = 0.3; [[0, 0, 7], [14, -8, 5], [-12, -9, 5], [2, 16, 4]].forEach(function (a, k) { if (k) seg([x, y], [x + a[0], y + a[1]], '#0FA3A3', 1.4); }); [[0, 0, 7], [14, -8, 5], [-12, -9, 5], [2, 16, 4]].forEach(function (a, k) { disc([x + a[0], y + a[1]], a[2], a[2], ['#2F7DE1', '#E8782A', '#0FA3A3', '#E0455A'][k]); }); ctx.globalAlpha = 1;
  }
}
function walls(T) {
  wallPair('#F7FAFB', '#E4EEF0', 74, ['#C9DADD', '#B3C7CB', '#B8CED2', '#9DB6BB']);
  for (let u = 1.5; u < N; u += 1.5) { seg(wpt('R', u, 7), wpt('R', u, 66), 'rgba(15,100,110,0.12)', 1); seg(wpt('L', u, 7), wpt('L', u, 66), 'rgba(15,100,110,0.15)', 1); }
  winW('R', 0.6, 2.4, 30, 62, '#CFEFF6', '#6F9AA3', 1); winW('R', 6.4, 8.2, 30, 62, '#CFEFF6', '#6F9AA3', 1);
  // armoires murales
  [[3.0, 4.6], [4.8, 6.2]].forEach(function (c) { winW('R', c[0], c[1], 30, 60, '#E8F1F3', '#8CA9AF', 0); const m = wpt('R', (c[0] + c[1]) / 2, 45); seg([m[0] - 3, m[1] - 5], [m[0] - 3, m[1] + 5], '#8CA9AF', 1.6); });
  // enseigne danger
  const hz = wpt('L', 1.6, 50); poly([[hz[0], hz[1] - 12], [hz[0] + 12, hz[1]], [hz[0], hz[1] + 12], [hz[0] - 12, hz[1]]], '#F2C230', '#222', 1.4); ctx.fillStyle = '#222'; ctx.fillRect(hz[0] - 1, hz[1] - 6, 2, 8); ctx.fillRect(hz[0] - 1, hz[1] + 4, 2, 2);
  // écran ECG
  const a = wpt('L', 3.2, 56), b = wpt('L', 6.4, 56), c = wpt('L', 6.4, 30), d = wpt('L', 3.2, 30); poly([a, b, c, d], '#0A2A30', '#6F9AA3', 1.4);
  ctx.strokeStyle = '#3CE0A0'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i <= 28; i++) { const t = i / 28, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + (d[1] - a[1]) * 0.5 + (c[1] - b[1]) * 0 ]; const ph = (t * 3 - T * 0.8) % 1, y = ph < 0.1 ? -8 * Math.sin(ph / 0.1 * Math.PI) : ph < 0.16 ? 5 * Math.sin((ph - 0.1) / 0.06 * Math.PI) : 0; if (i) ctx.lineTo(p[0], p[1] + y); else ctx.moveTo(p[0], p[1] + y); } ctx.stroke();
  // tuyaux menthe
  seg(P(0, 0, 64), P(N, 0, 64), '#8CCFC8', 3.4); seg(P(0, 0, 64), P(0, N, 64), '#6FB8B0', 3.4);
  [1.5, 4.5, 7.5].forEach(function (x) { seg(P(x, 0, 60), P(x, 0, 68), '#5A9A94', 2.6); });
}
function edge(T, ph) {
  if (ph !== 'over') return;
  seg(P(0, N, 0), P(N, N, 0), '#0FA3A3', 2.4); seg(P(N, N, 0), P(N, 0, 0), '#0FA3A3', 2.4);
  for (let i = 0; i < N; i++) { const p = P(i + 0.5, N, -7), q = P(N, i + 0.5, -7); ctx.fillStyle = Math.sin(T * 2 + i) > 0 ? '#3CE0A0' : '#9FCBC5'; ctx.fillRect(p[0] - 2, p[1] - 1, 4, 2.4); ctx.fillStyle = Math.sin(T * 2 + i + 1) > 0 ? '#0FA3A3' : '#9FCBC5'; ctx.fillRect(q[0] - 2, q[1] - 1, 4, 2.4); }
}
function flask(p, col, T, k, lvl) {
  poly([[p[0] - 2.5, p[1] - 16], [p[0] + 2.5, p[1] - 16], [p[0] + 8, p[1]], [p[0] - 8, p[1]]], 'rgba(255,255,255,0.5)', '#6F9AA3', 1);
  poly([[p[0] - 6.4 * lvl - 1, p[1] - 16 * lvl], [p[0] + 6.4 * lvl + 1, p[1] - 16 * lvl], [p[0] + 8, p[1]], [p[0] - 8, p[1]]].map(function (q, i) { return [q[0], i < 2 ? p[1] - 16 * lvl : q[1]]; }), rgba(col, 0.9));
  for (let b = 0; b < 3; b++) { const ph = (T * 0.8 + b / 3 + k) % 1; ctx.globalAlpha = 1 - ph; disc([p[0] + Math.sin(ph * 8 + b) * 2.4, p[1] - 3 - ph * 12], 1.4, 1.4, '#FFFFFF'); } ctx.globalAlpha = 1;
}
const deco = {
  plan: function (s, T, live, g) {
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 4, '#FFFFFF', '#9FB6BB', 1.6);
    const h = lt(s, 0.5, s.h - 18); poly(hexP(h, 7, 0), null, '#2F7DE1', 1.4); poly(hexP([h[0] + 12, h[1] + 4], 6, 0), null, '#E8782A', 1.4); seg([h[0] + 7, h[1]], [h[0] + 7, h[1] + 4], '#555', 1);
    [[1.1, 24, 0.7, '#2F7DE1'], [1.1, 17, 0.5, '#E0455A'], [1.1, 10, 0.8, '#27AE60'], [0.2, 11, 0.55, '#7B5CE0']].forEach(function (l) { lline(s, l[0] === 0.2 ? 0.2 : l[0] - 0.9, (l[0] === 0.2 ? 0.2 : l[0] - 0.9) + l[2], l[1], l[3], 1.6); });
    const c = lt(s, 1.6, 12); ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(c[0], c[1], 3, 0, 6.283); ctx.stroke();
    if (live) glowAt(h[0], h[1], 26, g, 0.25);
    flask(tp(s, 0.5, 0.5), '#2F7DE1', T, 0, 0.6);
  },
  library: function (s, T, live, g) {
    for (let sh = 0; sh < 3; sh++) {
      const z = 8 + sh * 15; lline(s, 0.05, s.w - 0.05, z, '#9FB6BB', 2);
      for (let k = 0; k < 8; k++) { const u = 0.15 + k * 0.29, col = ['#2F7DE1', '#E8782A', '#27AE60', '#E0455A', '#7B5CE0'][(k + sh) % 5]; lrect(s, u, u + 0.14, z, z + 11, 'rgba(255,255,255,0.55)', '#6F9AA3', 0.8); lrect(s, u + 0.01, u + 0.13, z, z + 4 + ((k * 3 + sh) % 6), rgba(col, 0.9)); lrect(s, u - 0.01, u + 0.15, z + 11, z + 13, '#8A6A45'); }
    }
    const m = tp(s, 0.7, 0.5); box(s.x + 1.6, s.y + 0.4, 0.4, 0.3, 4, '#2A3A44', s.h); seg([m[0] - 2, m[1] - 2], [m[0] + 2, m[1] - 14], '#C9D6DA', 3); if (live) glowAt(m[0], m[1] - 8, 14, '#0FA3A3', 0.5);
  },
  bench: function (s, T, live, g) {
    flask(tp(s, 0.2, 0.6), '#27AE60', T, 0, 0.55); flask(tp(s, 0.48, 0.35), '#E0455A', T, 1, 0.7);
    const b = tp(s, 0.78, 0.6); cyl(b, 4, 7, '#7A838D'); flame([b[0], b[1] - 7], live ? 5 : 3, T, 2); poly([[b[0] - 6, b[1] - 16], [b[0] + 6, b[1] - 16], [b[0] + 5, b[1] - 12], [b[0] - 5, b[1] - 12]], 'rgba(255,255,255,0.4)', '#6F9AA3', 0.8);
    ctx.strokeStyle = '#8A6A45'; ctx.lineWidth = 1.2; const a = tp(s, 0.2, 0.6, 6), c2 = tp(s, 0.78, 0.6, 12); ctx.beginPath(); ctx.moveTo(a[0], a[1] - 12); ctx.quadraticCurveTo((a[0] + c2[0]) / 2, a[1] - 24, c2[0], c2[1] - 6); ctx.stroke();
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.12, s.w - 0.12, 8, s.h - 4, '#0A2A30', '#9FB6BB', 1.2);
    ctx.strokeStyle = '#3CE0A0'; ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i <= 14; i++) { const u = 0.2 + (s.w - 0.4) * i / 14, p = lt(s, u, s.h - 14 + Math.sin(i * 0.8 + T * (live ? 8 : 2)) * (live ? 5 : 3)); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke();
    for (let k = 0; k < 3; k++) { const q = lt(s, 0.2 + k * 0.25, 12); ctx.fillStyle = [C.ok, C.warn, C.bad][k]; ctx.fillRect(q[0] - 1.5, q[1] - 1.5, 3, 3); }
    const c = tp(s, 0.5, 0.5, 4); disc(c, 11, 5.5, '#C9D6DA', '#6F9AA3', 1); disc([c[0], c[1] - 1], 8, 4, '#2A3A44'); const sp = T * (live ? 14 : 2);
    for (let i = 0; i < 4; i++) { const a = sp + i * Math.PI / 2; seg([c[0], c[1] - 1], [c[0] + Math.cos(a) * 8, c[1] - 1 + Math.sin(a) * 4], i % 2 ? '#E0455A' : '#2F7DE1', 2.4); }
  },
  tests: function (s, T, live, g) {
    const c = tp(s, 0.35, 0.5); ctx.fillStyle = 'rgba(190,235,240,0.45)'; ctx.fillRect(c[0] - 14, c[1] - 20, 28, 20); disc(c, 14, 6, 'rgba(190,235,240,0.55)'); disc([c[0], c[1] - 20], 14, 6, 'rgba(255,255,255,0.5)', '#6F9AA3', 1);
    ctx.strokeStyle = '#6F9AA3'; ctx.lineWidth = 1; ctx.strokeRect(c[0] - 14, c[1] - 20, 28, 20);
    [-6, 6].forEach(function (dx, i) { disc([c[0] + dx, c[1] - 2], 5, 2.4, '#FFF', '#6F9AA3', 0.8); disc([c[0] + dx, c[1] - 2.4], 3.4, 1.5, live ? ['#27AE60', '#E8782A'][i] : '#CFE3E1'); });
    if (live) glowAt(c[0], c[1] - 10, 20, '#27AE60', 0.35);
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#9FB6BB'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.78, 0.5, 9); seg(tp(s, 0.78, 0.5), p, '#8CA9AF', 3); if (lamp || live) glowAt(p[0], p[1] - 3, 26, col, 0.6); disc([p[0], p[1] - 3], 5.4, 5.4, col, '#1B3A40', 1);
  },
  dock: function (s, T, live, g) {
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? '#262626' : '#F2C230'); }
    [0.12, s.d - 0.12].forEach(function (yy, i) { const b = P(s.x + 0.5, s.y + yy, s.h), t = [b[0], b[1] - 16]; seg(b, t, '#9FB6BB', 3); glowAt(t[0], t[1], 12, '#3CE0A0', 0.6); disc(t, 3, 3, '#3CE0A0'); });
    const c = tp(s, 0.5, 0.5); for (let k = 0; k < 4; k++) { const ph = (T * 0.5 + k / 4) % 1; ctx.globalAlpha = (1 - ph) * 0.5; disc([c[0] + Math.sin(k * 3 + ph * 4) * 10, c[1] - ph * 24], 4 + ph * 6, 4 + ph * 6, '#DFF7F4'); } ctx.globalAlpha = 1;
  }
};
function cart(x, y) { box(x + 0.15, y + 0.2, 0.7, 0.6, 9, '#C9D6DA', 0); box(x + 0.2, y + 0.25, 0.6, 0.5, 2, '#9FB6BB', 9); [0.28, 0.62].forEach(function (u, i) { const p = P(x + u, y + 0.5, 15); cyl(p, 2.4, 9, ['#2F7DE1', '#E0455A'][i], 'rgba(255,255,255,0.6)'); }); [[0.2, 0.25], [0.75, 0.75]].forEach(function (w) { disc(P(x + w[0], y + w[1], 0), 2, 1.2, '#222'); }); }
function gasCyl(x, y) { [[0.32, 0.4, '#27AE60'], [0.66, 0.66, '#2F7DE1']].forEach(function (b) { const p = P(x + b[0], y + b[1]); cyl(p, 5, 24, b[2]); disc([p[0], p[1] - 24], 5, 2.5, '#C9D6DA'); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(p[0] - 5, p[1] - 14, 10, 2.4); }); }
export default {
  name: 'Laboratoire', fonts: { d: 'Sora', b: 'DM Sans', df: 'sans-serif', bf: 'sans-serif' }, fs: { lab: 0.92, chip: 0.98 },
  ui: { bg: '#E6F1F0', surface: '#FFFFFF', ink: '#0E2A2E', ink2: '#4F7075', line: '#CBE0DE', accent: '#0FA3A3', onAccent: '#FFFFFF', rad: 6, cssRad: '10px', upper: 0, ls: '-.01em', h1: 'clamp(28px,6vw,42px)', stageBg: '#F4FAFA', bodyBg: 'none', stageBorder: '#BDD9D6', stageShadow: '0 8px 28px rgba(15,100,110,.15)' },
  pal: { floorA: '#F3F7F8', floorB: '#E3ECEE', slab: '#B9CBCF', line: '#C5D6D9', ink: '#0E2A2E', ink2: '#4F7075', surface: '#FFFFFF', hat: '#F2B200', skin: '#F0C9A4', ok: '#1FA866', bad: '#E0455A', warn: '#E8A400', glow: '#0FA3A3',
    st: { plan: '#2F7DE1', library: '#0FA3A3', bench: '#E8782A', terminal: '#7B5CE0', tests: '#27AE60', dock: '#D9A800' }, ag: ['#E0523A', '#2B7CC0', '#9A5CC2', '#C9A000', '#D14A8B'] },
  floor: { kind: 'checker', inset: 1, insetA: 0.12, insetCol: '#0FA3A3', grid: 0.12, gridCol: '#0FA3A3', pad: 'tape', thick: 12, lane: '#0FA3A3', entry: ['#F2B200', '#242B2E'], halo: 0.3 },
  base: { k: 0.72, c: '#F4F8FA' }, vig: 0.08, vigCol: '#0A4A50', shadow: 0.7,
  txt: {
    title: 'Laboratoire des Agents', arrive: 'ENTRÉE', noun: 'chercheur',
    sub: "Chaque agent IA est un chercheur du laboratoire. Il se rend à la paillasse qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un poste ou un chercheur pour comprendre.",
    aria: "Laboratoire scientifique isométrique : des chercheurs représentent des agents IA et se déplacent entre les postes.",
    zones: {
      plan: ['PROTOCOLE', 'Tableau des protocoles', "L'agent prépare son protocole : il met à jour sa liste de tâches ou confie une expérience à un sous-agent (un assistant)."],
      library: ['ÉCHANTILLONS', "Bibliothèque d'échantillons", "L'agent consulte les échantillons et les archives : il lit des fichiers et cherche dans le code (ou sur le web) avant d'expérimenter."],
      bench: ['PAILLASSE', 'Paillasse', "L'agent modifie ou crée des fichiers. C'est ici que le code est mélangé, chauffé et transformé."],
      terminal: ['ANALYSE', 'Analyseur', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. La centrifugeuse tourne."],
      tests: ['ESSAIS', "Chambre d'essais", "L'agent lance les tests en chambre stérile. Le témoin devient vert si les tests réussissent, rouge s'ils échouent."],
      dock: ['SORTIE', 'Sas de décontamination', "Les agents qui ont fini leur mission passent par le sas de décontamination avant de quitter le laboratoire."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: cart, b: gasCyl }, tall: 34,
  torso: function (f, K, bob) {
    ctx.fillStyle = 'rgba(255,255,255,0.97)'; ctx.fillRect(f[0] - 6 * K, f[1] - 19.5 * K - bob, 4 * K, 14 * K); ctx.fillRect(f[0] + 2 * K, f[1] - 19.5 * K - bob, 4 * K, 14 * K);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.8; ctx.strokeRect(f[0] - 6 * K, f[1] - 19.5 * K - bob, 4 * K, 14 * K); ctx.strokeRect(f[0] + 2 * K, f[1] - 19.5 * K - bob, 4 * K, 14 * K);
    ctx.fillStyle = '#2F7DE1'; ctx.fillRect(f[0] + 3 * K, f[1] - 16.5 * K - bob, 1 * K, 3 * K);
  },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob, hair = ['#2B1D14', '#6B4226', '#1A1A1F', '#8A5A2B', '#C9A24A'][(a.ci + (a.parentId ? 2 : 0)) % 5];
    ctx.beginPath(); ctx.arc(f[0], y, 5.6 * K, Math.PI, 0); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
    ctx.strokeStyle = '#2A3A44'; ctx.lineWidth = 1.6 * K; ctx.beginPath(); ctx.moveTo(f[0] - 6.4 * K, y + 1.4 * K); ctx.lineTo(f[0] + 6.4 * K, y + 1.4 * K); ctx.stroke();
    [-2.6, 2.6].forEach(function (dx) { disc([f[0] + dx * K, y + 1.4 * K], 2.6 * K, 2.4 * K, 'rgba(120,230,230,0.55)', '#2A3A44', 1); });
  }
};
