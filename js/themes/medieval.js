// Thème « Château médiéval » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, flame, glowAt, lline, lrect, lt, poly, rgba, seg, stars, tp, vgrad, wallBricks, wallPair, winW, wpt } from '../render/draw-kit.js';
import { app } from '../store.js';

function bg(T) {
  vgrad(0, H0, [[0, '#070A1C'], [0.5, '#241F3E'], [0.85, '#5A3E3E'], [1, '#2A1D1A']]);
  stars(90, 11, '#FFF3D0');
  glowAt(110, 80, 90, '#FFE9B0', 0.25); disc([110, 80], 26, 26, '#F6ECC8'); disc([120, 74], 23, 23, 'rgba(36,31,62,0.35)');
  // collines + château lointain
  ctx.fillStyle = '#1A1522'; ctx.beginPath(); ctx.moveTo(0, 300); ctx.quadraticCurveTo(160, 230, 330, 290); ctx.quadraticCurveTo(480, 240, W0, 280); ctx.lineTo(W0, H0); ctx.lineTo(0, H0); ctx.fill();
  const cx = W0 - 160, cy = 232; ctx.fillStyle = '#120F1A';
  ctx.fillRect(cx - 40, cy, 80, 60); [[-44, 40], [-22, 52], [14, 46], [34, 38]].forEach(function (t) { ctx.fillRect(cx + t[0] - 8, cy - t[1] + 20, 16, t[1] + 40); poly([[cx + t[0] - 10, cy - t[1] + 20], [cx + t[0] + 10, cy - t[1] + 20], [cx + t[0], cy - t[1] - 2]], '#120F1A'); });
  ctx.fillStyle = '#F2C05A'; [[-14, 14], [4, 22], [-30, 10], [28, 10]].forEach(function (w, i) { ctx.globalAlpha = 0.6 + 0.3 * Math.sin(T * 2 + i); ctx.fillRect(cx + w[0], cy + w[1], 4, 6); }); ctx.globalAlpha = 1;
  // chauve-souris
  for (let i = 0; i < 3; i++) { const x = ((T * 22 + i * 190) % (W0 + 60)) - 30, y = 60 + i * 26 + Math.sin(T * 3 + i) * 8, w = Math.sin(T * 14 + i) * 4; poly([[x, y], [x - 7, y - 3 - w], [x - 3, y + 1], [x, y + 2], [x + 3, y + 1], [x + 7, y - 3 - w]], '#0A0812'); }
}
function torch(side, u, T, i) {
  const b = wpt(side, u, 36); seg(wpt(side, u, 30), b, '#4A2F1B', 3);
  flame([b[0], b[1] - 2], 4.5, T, i); glowAt(b[0], b[1] - 8, 30, '#FFB347', 0.28 + 0.06 * Math.sin(T * 9 + i));
}
function banner(side, u, col) {
  const a = wpt(side, u, 66), b = wpt(side, u + 0.7, 66), c = wpt(side, u + 0.7, 28), d = wpt(side, u + 0.35, 20), e = wpt(side, u, 28);
  poly([a, b, c, d, e], col, 'rgba(0,0,0,0.5)', 1); seg(a, b, '#C9A227', 2.4);
  const m = wpt(side, u + 0.35, 46); disc(m, 4.5, 4.5, '#F2D27A'); disc(m, 2, 2, col);
}
function walls(T) {
  wallPair('#7B756A', '#615C53', 74, ['#4A453D', '#3A362F', '#55504A', '#433F38']);
  wallBricks('R', 74, 'rgba(0,0,0,0.28)', 0.8, 0.9, 10); wallBricks('L', 74, 'rgba(0,0,0,0.28)', 0.8, 0.9, 10);
  [[1.4, 'R'], [6.4, 'R'], [2.2, 'L'], [5.6, 'L']].forEach(function (w) {   // meurtrières à arc
    const side = w[1], u = w[0];
    winW(side, u, u + 0.9, 30, 58, '#0C1030', '#2A2620', 0);
    const t = wpt(side, u + 0.45, 62); const a = wpt(side, u, 58), b = wpt(side, u + 0.9, 58);
    poly([a, b, t], '#0C1030', '#2A2620', 1.2);
    ctx.fillStyle = '#FFF3D0'; ctx.fillRect(t[0] - 1, t[1] + 12, 1.6, 1.6);
  });
  banner('R', 3.5, '#9E2B25'); banner('L', 3.9, '#2B4E8C');
  torch('R', 0.6, T, 0); torch('R', 5.3, T, 1); torch('R', 8.4, T, 2); torch('L', 1.0, T, 3); torch('L', 7.7, T, 4);
}
function edge(T, ph) {
  if (ph !== 'over') return;
  [['F', N], ['S', N]].forEach(function (e, k) {
    for (let r = 0; r < 2; r++) for (let i = 0; i < N * 2; i++) {
      const u = i / 2 + (r % 2) * 0.25, z = -r * 7; const a = k ? P(N, u, z) : P(u, N, z), b = k ? P(N, u + 0.5, z) : P(u + 0.5, N, z);
      seg(a, b, 'rgba(0,0,0,0.3)', 0.8); seg(a, [a[0], a[1] - 7], 'rgba(0,0,0,0.3)', 0.8);
    }
  });
  for (let i = 0; i < N; i++) { const p = P(i + 0.5, N, -1); ctx.fillStyle = 'rgba(70,120,60,0.55)'; ctx.fillRect(p[0] - 4, p[1] - 2, 8, 3); }
}
const deco = {
  plan: function (s, T, live, g) {       // conseil : tapisserie + étendard
    lrect(s, 0.2, s.w - 0.2, 8, s.h - 6, '#E8D7A8', '#6B4B25', 1.2);
    lline(s, 0.35, 1.5, s.h - 14, '#8B3A2B', 1.6); lline(s, 0.35, 1.1, s.h - 20, '#8B3A2B', 1.6); lline(s, 0.35, 1.7, s.h - 26, '#8B3A2B', 1.6);
    const m = lt(s, 1.55, 14); disc(m, 4, 4, '#B5382F'); seg(m, [m[0] + 3, m[1] - 3], '#3A2A18', 1.2);
    const a = tp(s, 0.5, 0.5); seg(a, [a[0], a[1] - 22], '#4A2F1B', 2);
    poly([[a[0], a[1] - 22], [a[0] + 14, a[1] - 18 + Math.sin(T * 3) * 2], [a[0] + 10, a[1] - 14 + Math.sin(T * 3 + 1) * 2], [a[0] + 14, a[1] - 10 + Math.sin(T * 3 + 2) * 2], [a[0], a[1] - 10]], '#B5382F', '#3A1410', 0.8);
  },
  library: function (s, T, live, g) {    // grimoires + chandelle
    for (let sh = 0; sh < 3; sh++) {
      const z = 8 + sh * 15; lline(s, 0.05, s.w - 0.05, z, '#3A2812', 2);
      for (let k = 0; k < 8; k++) { const u = 0.12 + k * 0.29, col = ['#6B2A2A', '#2A4E6B', '#4A2A6B', '#2A6B4A', '#8B6A1F'][(k + sh) % 5]; lrect(s, u, u + 0.2, z, z + 10 + (k % 3) * 1.5, col); lline(s, u, u + 0.2, z + 6, '#D9B84F', 0.9); }
    }
    const c = tp(s, 0.75, 0.5); ctx.fillStyle = '#F2EBD3'; ctx.fillRect(c[0] - 2, c[1] - 9, 4, 9); flame([c[0], c[1] - 9], 3, T, 5);
    if (live) glowAt(lt(s, 1.2, 30)[0], lt(s, 1.2, 30)[1], 40, '#C9A6FF', 0.25);
  },
  bench: function (s, T, live, g) {      // forge + enclume
    box(s.x + 0.25, s.y + 0.55, 0.9, 0.9, 7, '#3E3A36', s.h); const co = tp(s, 0.45, 0.5, 7);
    disc(co, 12, 6, '#1A1210'); disc(co, 9, 4.5, live ? '#FF6A1A' : '#8A2E10'); glowAt(co[0], co[1], 26, '#FF7A1A', live ? 0.6 : 0.3);
    flame([co[0], co[1]], live ? 6 : 3.5, T, 1);
    const an = tp(s, 0.78, 0.55, 0); poly([[an[0] - 11, an[1] - 4], [an[0] + 12, an[1] - 4], [an[0] + 7, an[1] - 8], [an[0] - 8, an[1] - 8]], '#6B7480', '#2A2E34', 1);
    ctx.fillStyle = '#4A5058'; ctx.fillRect(an[0] - 5, an[1] - 4, 10, 4);
    if (live) { const a = Math.abs(Math.sin(T * 6)); seg([an[0] + 2, an[1] - 8 - 12 * a], [an[0] + 9, an[1] - 14 - 12 * a], '#8A5A2A', 2.4); ctx.fillStyle = '#5A606A'; ctx.fillRect(an[0] + 6, an[1] - 18 - 12 * a, 7, 4); }
  },
  terminal: function (s, T, live, g) {   // tour du mage : runes + cristal
    lrect(s, 0.12, s.w - 0.12, 8, s.h - 6, '#1A1830');
    for (let k = 0; k < 3; k++) { const c = lt(s, 0.5, 12 + k * 8); const on = live ? 0.5 + 0.5 * Math.sin(T * 4 + k * 2) : 0.5; ctx.strokeStyle = rgba('#7FE8E0', on); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(c[0], c[1], 3.2, 0, 6.283); ctx.moveTo(c[0] - 3, c[1]); ctx.lineTo(c[0] + 3, c[1]); ctx.stroke(); }
    const c = tp(s, 0.5, 0.5, 14 + Math.sin(T * 2) * 2);
    glowAt(c[0], c[1], 24, g, live ? 0.7 : 0.4);
    poly([[c[0], c[1] - 9], [c[0] + 6, c[1]], [c[0], c[1] + 9], [c[0] - 6, c[1]]], '#8FF3EA', '#2A8F88', 1); seg([c[0], c[1] - 9], [c[0], c[1] + 9], 'rgba(255,255,255,0.6)', 0.8);
    poly([[s.x, s.y, s.h], [s.x + s.w, s.y, s.h]].map(function (q) { return P(q[0], q[1], q[2]); }).concat([P(s.x + s.w / 2, s.y + s.d / 2, s.h + 6)]), '#3E3A36');
  },
  tests: function (s, T, live, g) {      // arène : mannequin + cible, gemme-témoin
    const d = tp(s, 0.28, 0.5); seg(d, [d[0], d[1] - 20], '#6B4A25', 3); seg([d[0] - 9, d[1] - 14], [d[0] + 9, d[1] - 14], '#6B4A25', 2.6); disc([d[0], d[1] - 23], 4, 4, '#D9B96A', '#6B4A25', 1);
    if (live) { ctx.save(); ctx.translate(d[0], d[1] - 14); ctx.rotate(Math.sin(T * 14) * 0.08); ctx.restore(); }
    const tg = lt(s, 1.3, 9); disc(tg, 8, 8, '#F2EBD3', '#6B4A25', 1); disc(tg, 5.5, 5.5, '#B5382F'); disc(tg, 3, 3, '#F2EBD3'); disc(tg, 1.4, 1.4, '#B5382F');
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#8A8F98'; if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.72, 0.5, 11); seg(tp(s, 0.72, 0.5), p, '#6B4A25', 3);
    if (lamp || live) glowAt(p[0], p[1] - 3, 26, col, 0.6); poly([[p[0], p[1] - 9], [p[0] + 5, p[1] - 3], [p[0], p[1] + 3], [p[0] - 5, p[1] - 3]], col, '#222', 1);
  },
  dock: function (s, T, live, g) {       // pont-levis + torches
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? '#7A5630' : '#8A6538', '#3A2812', 0.8); }
    [0.12, s.d - 0.12].forEach(function (yy, i) { const b = P(s.x + 0.5, s.y + yy, s.h); seg(b, [b[0], b[1] - 16], '#4A2F1B', 3); flame([b[0], b[1] - 17], 4, T, i + 7); });
    seg(P(s.x + 0.15, s.y, s.h), P(s.x + 0.15, s.y + s.d, s.h + 10), 'rgba(80,80,80,0.8)', 1);
  }
};
function barrel(x, y) {
  const p = P(x + 0.5, y + 0.5); cyl(p, 9, 18, '#7A5230'); seg([p[0] - 9, p[1] - 12], [p[0] + 9, p[1] - 12], '#3A2812', 2); seg([p[0] - 9, p[1] - 5], [p[0] + 9, p[1] - 5], '#3A2812', 2);
}
function chest(x, y, T) {
  box(x + 0.15, y + 0.2, 0.7, 0.55, 10, '#7A4A22', 0); box(x + 0.15, y + 0.2, 0.7, 0.55, 5, '#8A5A2A', 10);
  seg(P(x + 0.15, y + 0.75, 7), P(x + 0.85, y + 0.75, 7), '#C9A227', 2); const k = P(x + 0.5, y + 0.75, 7); disc(k, 2, 2, '#F2D27A');
  const t = P(x + 0.5, y + 0.45, 16); if (Math.sin(T * 3) > 0.5) glowAt(t[0], t[1], 10, '#FFE08A', 0.7);
}
export default {
  name: 'Château médiéval', fonts: { d: 'Cinzel', b: 'EB Garamond', df: 'serif', bf: 'serif' }, fs: { lab: 0.85, chip: 1.12 },
  ui: { bg: '#15100C', surface: '#241B14', ink: '#F0E4C8', ink2: '#B9A888', line: '#3E3022', accent: '#D9A441', onAccent: '#1A1008', rad: 3, cssRad: '3px', upper: 1, ls: '.06em', h1: 'clamp(24px,5.5vw,38px)', stageBg: '#0B0A12', glow: 0,
    bodyBg: 'radial-gradient(ellipse at 50% -20%, rgba(217,164,65,.14), transparent 60%)', stageBorder: '#8A6A2E', stageShadow: '0 0 0 3px #1A1008, 0 0 0 4px #5A421C, 0 12px 30px rgba(0,0,0,.5)' },
  pal: { floorA: '#6E675C', floorB: '#625B51', slab: '#4A453D', line: '#4A453D', ink: '#F0E4C8', ink2: '#B9A888', surface: '#241B14', hat: '#E9B949', skin: '#E8BE98', ok: '#6FCB6A', bad: '#E5594A', warn: '#F2B83A', glow: '#D9A441',
    st: { plan: '#B5382F', library: '#7A5BA8', bench: '#E07B2A', terminal: '#3FA7A0', tests: '#6E9A3A', dock: '#8A6A45' }, ag: ['#C94A3A', '#3E7FBF', '#8D5BC0', '#C9A227', '#3F9A62'] },
  floor: { kind: 'cobble', pad: 'rug', thick: 16, lane: '#E9B949', entry: ['#B5382F', '#E9C97A'], halo: 0.34 },
  base: { k: 0.5, c: '#7B7468' }, vig: 0.45, vigCol: '#0A0610', spark: '#FFB347',
  txt: {
    title: 'Château des Agents', arrive: 'ENTRÉE', noun: 'chevalier',
    sub: "Chaque agent IA est un habitant du château. Il se rend à la salle qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) une salle ou un personnage pour comprendre.",
    aria: "Château médiéval isométrique : des chevaliers représentent des agents IA et se déplacent entre les salles.",
    zones: {
      plan: ['CONSEIL', 'Salle du conseil', "L'agent organise sa campagne : il met à jour sa liste de tâches ou confie une quête à un sous-agent."],
      library: ['GRIMOIRES', 'Bibliothèque des grimoires', "L'agent consulte les grimoires : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['FORGE', 'Forge', "L'agent modifie ou crée des fichiers. C'est ici que le code est battu et façonné."],
      terminal: ['SORTILÈGES', 'Tour du mage', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git. Chaque commande est un sortilège."],
      tests: ['ARÈNE', "Arène d'entraînement", "L'agent lance les tests contre le mannequin. La gemme devient verte si les tests réussissent, rouge s'ils échouent."],
      dock: ['PORTAIL', 'Pont-levis', "Les agents qui ont fini leur quête franchissent le pont-levis avant de quitter le château."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: barrel, b: chest }, tall: 35,
  torso: function (f, K, bob) { ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fillRect(f[0] - 0.9 * K, f[1] - 19 * K - bob, 1.8 * K, 12 * K); ctx.fillRect(f[0] - 4 * K, f[1] - 15 * K - bob, 8 * K, 1.8 * K); ctx.fillStyle = '#8A8F98'; ctx.fillRect(f[0] - 6 * K, f[1] - 7.5 * K - bob, 12 * K, 2 * K); },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob;
    ctx.beginPath(); ctx.arc(f[0], y, 6 * K, Math.PI, 0); ctx.closePath(); ctx.fillStyle = '#9AA3AE'; ctx.fill(); ctx.strokeStyle = '#3A3F46'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#7C8590'; ctx.fillRect(f[0] - 6.4 * K, y - 0.4 * K, 12.8 * K, 1.6 * K); ctx.fillStyle = '#7C8590'; ctx.fillRect(f[0] - 0.8 * K, y, 1.6 * K, 5 * K);
    const sway = Math.sin(T * 5) * 1.2 * K; poly([[f[0] - 1 * K, y - 6 * K], [f[0] + 1 * K, y - 6 * K], [f[0] + 4 * K + sway, y - 12 * K], [f[0] + sway, y - 11 * K]], col, '#00000055', 0.6);
  }
};
