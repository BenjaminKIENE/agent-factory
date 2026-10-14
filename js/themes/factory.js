// Thème « Usine » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, TH, TW, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, glowAt, lline, lrect, mix, poly, seg, tp, vgrad, wallBricks, wallPair, winW, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

function bg(T) {
  vgrad(0, H0, [[0, '#8C97A3'], [0.6, '#B8B3A8'], [1, '#D6C9AE']]);
  // silhouettes de cheminées + fumée
  [[40, 70, 22], [96, 52, 18], [W0 - 60, 78, 24], [W0 - 120, 58, 18]].forEach(function (c, i) {
    ctx.fillStyle = '#6A7480'; ctx.fillRect(c[0] - c[2] / 2, c[1], c[2], H0); ctx.fillStyle = '#C44'; ctx.fillRect(c[0] - c[2] / 2, c[1], c[2], 6);
    for (let k = 0; k < 5; k++) { const ph = (T * 0.25 + k / 5 + i * 0.3) % 1; ctx.globalAlpha = (1 - ph) * 0.38; disc([c[0] + ph * 26, c[1] - ph * 60], 9 + ph * 16, 9 + ph * 16, '#5A6068'); }
    ctx.globalAlpha = 1;
  });
}
function walls() {
  wallPair('#AEB8BE', '#8C979F', 74, ['#8F9AA2', '#78838B', '#7A858D', '#65707A']);
  wallBricks('R', 74, 'rgba(0,0,0,0.08)', 0.6, 1.2, 14); wallBricks('L', 74, 'rgba(0,0,0,0.08)', 0.6, 1.2, 14);
  [0.4, 1.9, 5.7, 7.2].forEach(function (x) { winW('R', x, x + 1.2, 38, 64, '#CFE0E8', '#4B5760', 1); });
  [0.5, 2.2, 3.9, 5.6, 7.3].forEach(function (y) { winW('L', y, y + 1.2, 38, 64, '#B4C8D2', '#4B5760', 1); });
  const z = 58; seg(P(0, 0, z), P(N, 0, z), '#3F4750', 4.2); seg(P(0, 0, z + 1), P(N, 0, z + 1), '#7C8791', 2.4); seg(P(0, 0, z), P(0, N, z), '#2F363D', 4.2); seg(P(0, 0, z + 1), P(0, N, z + 1), '#6B7680', 2.4);
  [1.5, 4.5, 7.5].forEach(function (x) { seg(P(x, 0, z - 4), P(x, 0, z + 4), '#2F363D', 3); });
  poly(wq(3.3, 0, 5.5, 0, 33, 56), '#1F262B');
  ctx.save(); const o = P(3.5, 0, 40); ctx.translate(o[0], o[1]); ctx.transform(1, TH / TW, 0, 1, 0, 0);
  ctx.font = "700 9px 'Barlow Condensed', 'Arial Narrow', sans-serif"; ctx.fillStyle = '#F2B823'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText("USINE D'AGENTS", 0, 0); ctx.restore();
}
function edge(T, ph) {
  if (ph !== 'over') return;
  for (let i = 0; i < N; i++) { const a = P(i, N, 0), b = P(i + 1, N, 0), c = P(i + 1, N, -4), d = P(i, N, -4); poly([a, b, c, d], i % 2 ? '#F2B823' : '#23282D'); }
  for (let j = 0; j < N; j++) { const a = P(N, j, 0), b = P(N, j + 1, 0), c = P(N, j + 1, -4), d = P(N, j, -4); poly([a, b, c, d], j % 2 ? '#F2B823' : '#23282D'); }
}
const deco = {
  plan: function (s, T, live, g) {
    for (let i = 0; i < 3; i++) { const z = s.h - 9 - i * 10; lline(s, 0.45, s.w - 0.3, z, mix(g, '#fff', 0.6), 2.2); lrect(s, 0.15, 0.3, z - 2.5, z + 2.5, mix(g, '#fff', 0.85)); }
    [[1.05, 30, 0], [1.4, 20, 1], [1.7, 10, 2]].forEach(function (n) { lrect(s, n[0], n[0] + 0.22, n[1], n[1] + 5, n[2] === 0 ? C.hat : C.ag[n[2] % 5]); });
    const a = tp(s, 0.5, 0.5); seg(a, [a[0], a[1] - 14], '#40464C', 2); poly([[a[0], a[1] - 14], [a[0] + 11, a[1] - 10 + Math.sin(T * 3) * 1.5], [a[0], a[1] - 6]], '#D9472B');
  },
  library: function (s, T, live, g) {
    for (let sh = 0; sh < 3; sh++) {
      const z = 8 + sh * 15; lline(s, 0.05, s.w - 0.05, z, mix(g, '#000', 0.55), 1.6);
      for (let k = 0; k < 7; k++) { const u = 0.15 + k * 0.33; lrect(s, u, u + 0.2, z, z + 10 + (k % 3) * 1.5, mix(C.ag[(k + sh) % 5], '#fff', 0.15)); }
    }
  },
  bench: function (s, T, live, g) {
    box(s.x + 0.4, s.y + 0.4, 0.6, 0.6, 9, mix(g, '#000', 0.35), s.h);   // enclume
    box(s.x + 1.2, s.y + 1.2, 0.6, 0.4, 4, mix(g, '#fff', 0.3), s.h);
    const c = tp(s, 0.65, 0.3, 1), rot = live ? T * 2.4 : 0.3, pts = [];
    for (let i = 0; i < 16; i++) { const rad = i % 2 ? 7 : 9; pts.push([c[0] + Math.cos(rot + i * Math.PI / 8) * rad, c[1] + Math.sin(rot + i * Math.PI / 8) * rad * 0.5]); }
    poly(pts, '#8E9AA3', '#3E464C', 0.8); disc(c, 2.6, 1.4, '#3E464C');
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.15, s.w - 0.15, 9, s.h - 6, '#0A100E');
    for (let i = 0; i < 3; i++) { const w = live ? 0.3 + 0.4 * Math.abs(Math.sin(T * 5 + i * 2)) : 0.35; lline(s, 0.25, 0.25 + w * 0.8, s.h - 11 - i * 6, '#3EE07A', 1.6); }
    if (Math.floor(T * 2) % 2 === 0) lline(s, 0.7, 0.82, 12, '#3EE07A', 2);
    const ant = tp(s, 0.5, 0.5); seg(ant, [ant[0], ant[1] - 12], '#40464C', 1.6); disc([ant[0], ant[1] - 13], 2.4, 2.4, live && Math.floor(T * 3) % 2 ? C.warn : C.ok);
  },
  tests: function (s, T, live, g) {
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#7A8590';
    if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.5, 0.5, 9); seg(tp(s, 0.5, 0.5), p, '#3E464C', 3);
    if (lamp) glowAt(p[0], p[1] - 3, 26, col, 0.5); disc([p[0], p[1] - 3], 6, 6, col, '#1B2321', 1);
    for (let i = 0; i < 3; i++) lrect(s, 0.4 + i * 0.5, 0.7 + i * 0.5, 5, 10, mix(g, '#fff', 0.45));
  },
  dock: function (s, T, live, g) {
    const off = (T * 0.25) % (s.d / 8);
    for (let k = 0; k < 8; k++) { const y = s.y + off + k * (s.d / 8); if (y > s.y + s.d - 0.02) continue; seg(P(s.x + 0.08, y, s.h), P(s.x + s.w - 0.08, y, s.h), mix(g, '#fff', 0.3), 1.3); }
    const cy = s.y + ((T * 0.18) % 1) * (s.d - 0.5); box(s.x + 0.25, cy, 0.5, 0.4, 7, '#B8782A', s.h);
  }
};
function crate(x, y) { const w = '#B8782A'; box(x + 0.1, y + 0.1, 0.8, 0.8, 14, w, 0); box(x + 0.2, y + 0.2, 0.6, 0.6, 12, mix(w, '#fff', 0.1), 14); seg(P(x + 0.1, y + 0.9, 7), P(x + 0.9, y + 0.9, 7), mix(w, '#000', 0.45), 1.2); }
function barrels(x, y) {
  [[0.3, 0.3, '#3F6FD6'], [0.7, 0.7, '#6B7A80']].forEach(function (b) {
    const p = P(x + b[0], y + b[1]); cyl(p, 8, 15, mix(b[2], '#000', 0.25)); seg([p[0] - 8, p[1] - 10], [p[0] + 8, p[1] - 10], mix(b[2], '#000', 0.6), 1.2); seg([p[0] - 8, p[1] - 4], [p[0] + 8, p[1] - 4], mix(b[2], '#000', 0.6), 1.2);
  });
}
export default {
  name: 'Usine', fonts: { d: 'Barlow Condensed', b: 'Barlow', df: "'Arial Narrow', sans-serif" }, fs: { lab: 1.1 },
  ui: { bg: '#DADCD6', surface: '#F3F5F3', ink: '#1B2321', ink2: '#4C5A57', line: '#B8BFBA', accent: '#1B2321', onAccent: '#F3F5F3', rad: 3, cssRad: '4px', upper: 1, ls: '.03em', h1: 'clamp(30px,6.5vw,46px)', stageBg: '#EEF0EC', bodyBg: 'none', stageBorder: '#9BA3A0', stageShadow: 'none' },
  pal: { floorA: '#CBD0CF', floorB: '#C0C6C4', slab: '#8F9A98', line: '#A5AEAC', ink: '#1B2321', ink2: '#4C5A57', surface: '#F3F5F3', hat: '#F2B823', skin: '#F0C9A4', ok: '#2E9B4F', bad: '#D23B3B', warn: '#E0A100', glow: '#E07B1A',
    st: { plan: '#3F6FD6', library: '#1E9B8B', bench: '#D98B1A', terminal: '#7A5CD0', tests: '#3A9A4B', dock: '#6B7A80' }, ag: ['#D9472B', '#2B7CC0', '#9A5CC2', '#B89500', '#D14A8B'] },
  floor: { kind: 'checker', grid: 0.35, pad: 'tape', thick: 12 }, base: { k: 0 },
  txt: {
    title: "Usine d'Agents", arrive: 'ARRIVÉE', noun: 'ouvrier',
    sub: "Chaque agent IA est un ouvrier. Il se déplace vers le poste qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un poste ou un ouvrier pour comprendre.",
    aria: "Usine isométrique : des ouvriers représentent des agents IA et se déplacent entre les postes.",
    zones: {
      plan: ['TÂCHES', 'Tableau des tâches', "L'agent organise son travail : il met à jour sa liste de tâches ou confie une mission à un sous-agent."],
      library: ['LECTURE', 'Lecture du code', "L'agent lit des fichiers et cherche dans le code (ou sur le web) pour comprendre avant de modifier quoi que ce soit."],
      bench: ['ÉCRITURE', 'Écriture du code', "L'agent modifie ou crée des fichiers. C'est ici que le code change vraiment."],
      terminal: ['COMMANDES', 'Commandes', "L'agent lance des commandes dans le terminal : compiler le projet, installer des paquets, utiliser git."],
      tests: ['TESTS', 'Tests', "L'agent lance les tests pour vérifier que tout fonctionne. La lampe devient verte si les tests réussissent, rouge s'ils échouent."],
      dock: ['TERMINÉ', 'Mission terminée', "Les agents qui ont fini leur mission viennent ici avant de quitter l'usine."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: crate, b: barrels },
  torso: function (f, K, bob) { ctx.fillStyle = 'rgba(242,184,35,0.95)'; ctx.fillRect(f[0] - 6 * K, f[1] - 13 * K - bob, 12 * K, 2 * K); },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob;
    ctx.beginPath(); ctx.arc(f[0], y, 5.8 * K, Math.PI, 0); ctx.closePath(); ctx.fillStyle = '#F2B823'; ctx.fill(); ctx.strokeStyle = ol; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(f[0] - 5.8 * K, y - 1.6 * K, 11.6 * K, 1.6 * K); ctx.fillStyle = '#F2B823'; ctx.fillRect(f[0] - 7 * K, y - 0.4 * K, 14 * K, 1.5 * K);
  }
};
