// Thème « Cyberpunk » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, TH, TW, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, cyl, disc, glowAt, hsh, lline, lrect, lt, poly, rgba, rt, seg, tp, vgrad } from '../render/draw-kit.js';
import { app } from '../store.js';

let BLD = null;
function mkCity() {
  let sd = 21; const r = function () { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  BLD = [];
  [[0.55, '#120A26', 60, 150], [0.75, '#1A0E38', 90, 210]].forEach(function (L, li) {
    for (let x = -10; x < W0 + 20;) { const w = 26 + r() * 34, h = L[2] + r() * L[3] * 0.6; const win = []; for (let k = 0; k < 14; k++) win.push([r(), r(), r() < 0.5 ? 0 : r() < 0.5 ? 1 : 2, r()]); BLD.push({ x: x, w: w, h: h, col: L[1], li: li, win: win, sign: r() < 0.22 ? ['#FF2BD6', '#18E6FF', '#FFE14D'][Math.floor(r() * 3)] : null, sy: r() }); x += w + 2 + r() * 6; }
  });
}
function bg(T) {
  if (!BLD) mkCity();
  vgrad(0, H0, [[0, '#06020F'], [0.45, '#1A0833'], [0.8, '#3A0B48'], [1, '#12061E']]);
  glowAt(W0 / 2, 250, 300, '#FF2BD6', 0.12);
  BLD.forEach(function (b) {
    const top = 292 - b.h * (b.li ? 1 : 0.85), bw = b.w;
    ctx.fillStyle = b.col; ctx.fillRect(b.x, top, bw, H0);
    if (b.li) { ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(b.x, top, 3, H0); }
    b.win.forEach(function (w, i) { const on = (Math.sin(T * 0.8 + i + b.x) > -0.8); ctx.fillStyle = [rgba('#FFE14D', 0.8), rgba('#18E6FF', 0.8), rgba('#FF2BD6', 0.8)][w[2]]; ctx.globalAlpha = on ? 0.35 + w[3] * 0.4 : 0.06; ctx.fillRect(b.x + 3 + w[0] * (bw - 8), top + 6 + w[1] * Math.min(b.h - 10, 130), 2.4, 3); }); ctx.globalAlpha = 1;
    if (b.sign) { const sy = top + 14 + b.sy * 40; glowAt(b.x + bw / 2, sy + 4, 26, b.sign, 0.32 + 0.1 * Math.sin(T * 7 + b.x)); ctx.fillStyle = b.sign; ctx.fillRect(b.x + 4, sy, bw - 8, 3); ctx.fillRect(b.x + 4, sy + 7, (bw - 8) * 0.6, 2); }
  });
  for (let i = 0; i < 4; i++) { const x = ((T * (30 + i * 11) + i * 170) % (W0 + 80)) - 40, y = 70 + i * 30; seg([x - 10, y], [x, y], rgba('#FF2BD6', 0.7), 2); glowAt(x, y, 8, '#FF8AE8', 0.8); glowAt(x - 10, y, 5, '#FF2BD6', 0.5); }
}
function fx(T) {   // pluie
  ctx.strokeStyle = 'rgba(160,200,255,0.28)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < 110; i++) { const sp = 160 + (i % 7) * 25, x = (i * 53.7 + T * 40) % (W0 + 40) - 20, y = ((T * sp + i * 71) % (H0 + 30)) - 15; ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9); }
  ctx.stroke();
}
function walls(T) {
  const z = 14, fl = 0.85 + 0.15 * Math.sin(T * 17) * (Math.sin(T * 3.1) > 0.9 ? 1 : 0);
  [['R', '#FF2BD6'], ['L', '#18E6FF']].forEach(function (e) {
    const a = e[0] === 'R' ? P(0, 0, z) : P(0, 0, z), b = e[0] === 'R' ? P(N, 0, z) : P(0, N, z);
    glowAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 90, e[1], 0.12 * fl); seg(a, b, rgba(e[1], 0.35), 7); seg(a, b, e[1], 2.2); seg(a, b, '#FFFFFF', 0.8);
    for (let i = 0; i <= 3; i++) { const p = e[0] === 'R' ? P(i * 3, 0, 0) : P(0, i * 3, 0), q = [p[0], p[1] - z]; seg(p, q, '#2A2240', 3); }
  });
  // panneau holographique
  const c = P(4.4, 0, 62); ctx.save(); ctx.translate(c[0], c[1]); ctx.transform(1, TH / TW, 0, 1, 0, 0);
  ctx.globalAlpha = 0.85; ctx.fillStyle = 'rgba(24,230,255,0.12)'; ctx.fillRect(-4, -26, 118, 40); ctx.strokeStyle = '#18E6FF'; ctx.lineWidth = 1.4; ctx.strokeRect(-4, -26, 118, 40);
  ctx.font = "700 14px 'Chakra Petch', sans-serif"; ctx.fillStyle = '#18E6FF'; ctx.textAlign = 'left'; ctx.fillText('NEON·AGENTS', 2, -6);
  ctx.fillStyle = '#FF2BD6'; ctx.fillRect(2, 2, 70 + Math.sin(T * 3) * 20, 3); ctx.fillStyle = '#FFE14D'; ctx.fillRect(2, 8, 40, 2);
  if (Math.sin(T * 5) > 0.92) { ctx.fillStyle = 'rgba(255,43,214,0.5)'; ctx.fillRect(-4, -14, 118, 5); } ctx.restore(); ctx.globalAlpha = 1;
}
function edge(T, ph) {
  if (ph !== 'over') return;
  seg(P(0, N, 0), P(N, N, 0), '#FF2BD6', 2.4); seg(P(N, N, 0), P(N, 0, 0), '#18E6FF', 2.4);
  seg(P(0, N, -14), P(N, N, -14), rgba('#FF2BD6', 0.5), 1.2); seg(P(N, N, -14), P(N, 0, -14), rgba('#18E6FF', 0.5), 1.2);
  const q = P(N / 2, N, -2); glowAt(q[0], q[1] + 14, 80, '#FF2BD6', 0.14);
  for (let i = 0; i < 7; i++) { const u = 0.7 + i * 1.2, p = P(u, N, -14), l = 4 + 6 * ((T * 0.6 + i * 0.37) % 1); ctx.globalAlpha = 1 - ((T * 0.6 + i * 0.37) % 1) * 0.8; seg(p, [p[0], p[1] + l], '#FF2BD6', 1.4); } ctx.globalAlpha = 1;
}
const deco = {
  plan: function (s, T, live, g) {
    for (let i = 0; i < 4; i++) { const l = 0.5 + (live ? 0.7 * Math.abs(Math.sin(T * 2 + i * 1.7)) : 0.5); lline(s, 0.25, 0.25 + l, s.h - 8 - i * 8, rgba(g, 0.95), 2); lline(s, 0.25 + l + 0.1, 0.25 + l + 0.2, s.h - 8 - i * 8, '#18E6FF', 2); }
    const c = tp(s, 0.5, 0.5, 20 + Math.sin(T * 2) * 2), r = 9, a = T * 1.6; glowAt(c[0], c[1], 28, g, live ? 0.6 : 0.35);
    const pts = []; for (let i = 0; i < 4; i++) pts.push([c[0] + Math.cos(a + i * Math.PI / 2) * r, c[1] + Math.sin(a + i * Math.PI / 2) * r * 0.5]);
    ctx.strokeStyle = '#FFB3F0'; ctx.lineWidth = 1.3; [0, 1].forEach(function (k) { ctx.beginPath(); pts.forEach(function (p, i) { const y = p[1] + (k ? 7 : -7); if (i) ctx.lineTo(p[0], y); else ctx.moveTo(p[0], y); }); ctx.closePath(); ctx.stroke(); }); pts.forEach(function (p) { seg([p[0], p[1] - 7], [p[0], p[1] + 7], '#FFB3F0', 1); });
  },
  library: function (s, T, live, g) {
    lrect(s, 0.1, s.w - 0.1, 6, s.h - 4, '#05101A', rgba(g, 0.8), 1);
    for (let k = 0; k < 9; k++) { const u = 0.2 + k * 0.255; for (let j = 0; j < 7; j++) { const ph = (T * (live ? 2.4 : 0.8) + k * 0.37 + j * 0.14) % 1; const q = lt(s, u, s.h - 8 - j * 6); ctx.fillStyle = rgba(j % 2 ? g : '#39FF9C', 0.2 + 0.8 * (1 - ph)); ctx.fillRect(q[0] - 1.2, q[1] - 1.2, 2.4, 2.4); } }
  },
  bench: function (s, T, live, g) {
    const c = tp(s, 0.5, 0.5); poly([tp(s, 0.12, 0.15), tp(s, 0.88, 0.15), tp(s, 0.88, 0.85), tp(s, 0.12, 0.85)], '#08241C', '#39FF9C', 1);
    ctx.strokeStyle = rgba('#18E6FF', 0.9); ctx.lineWidth = 1; ctx.beginPath(); [[0.2, 0.3, 0.5, 0.3], [0.5, 0.3, 0.5, 0.6], [0.5, 0.6, 0.8, 0.6], [0.3, 0.7, 0.7, 0.7]].forEach(function (l) { const a = tp(s, l[0], l[1]), b = tp(s, l[2], l[3]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); ctx.stroke();
    box(s.x + 0.85, s.y + 0.8, 0.35, 0.35, 3, '#1A1A28', s.h); glowAt(c[0], c[1] - 3, 16, '#FFE14D', live ? 0.6 : 0.25);
    const j = [c[0] + 14 + Math.sin(T * 3) * (live ? 6 : 0), c[1] - 20]; seg([c[0] + 22, c[1] - 30], j, '#8A8FA8', 2.4); seg(j, [j[0] - 6, c[1] - 4], '#C5CAD8', 1.6);
    if (live) glowAt(j[0] - 6, c[1] - 4, 12, '#FFFFFF', 0.4 + 0.5 * Math.abs(Math.sin(T * 25)));
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.1, s.w - 0.1, 8, s.h - 4, '#030A06', rgba(g, 0.95), 1.2);
    for (let i = 0; i < 6; i++) { const ph = (T * (live ? 14 : 3) + i * 7.3) % 20, w = 0.2 + hsh(i, Math.floor(T * (live ? 4 : 1))) * 0.55; lline(s, 0.2, 0.2 + w, s.h - 7 - ((i * 5 + ph) % 22), rgba('#39FF9C', 0.85), 1.6); }
    if (Math.sin(T * 4) > 0.8) lrect(s, 0.1, s.w - 0.1, 14, 17, rgba('#FF3B6B', 0.6));
    for (let k = 0; k < 6; k++) { const q = rt(s, 0.12 + k * 0.15, 10); ctx.fillStyle = [C.glow, '#18E6FF', '#FFE14D'][k % 3]; ctx.fillRect(q[0] - 1.5, q[1] - 1.5, 3, 3); }
    const a = tp(s, 0.5, 0.5); glowAt(a[0], a[1] - 3, 12, g, 0.6);
  },
  tests: function (s, T, live, g) {
    const c = tp(s, 0.35, 0.5); ctx.fillStyle = rgba(g, 0.12); ctx.fillRect(c[0] - 14, c[1] - 26, 28, 26); disc(c, 14, 7, rgba(g, 0.5)); disc([c[0], c[1] - 26], 14, 7, rgba('#FFFFFF', 0.12), g, 1.4);
    const ph = (T * (live ? 1.6 : 0.5)) % 1, y = c[1] - 26 * ph; ctx.strokeStyle = rgba('#7CFF4D', 0.9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(c[0], y, 14, 7, 0, 0, 6.283); ctx.stroke();
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#7A7098'; if (live && Math.floor(T * 5) % 2 === 0) col = C.warn;
    const p = tp(s, 0.78, 0.5, 9); seg(tp(s, 0.78, 0.5), p, '#3A3060', 3); if (lamp || live) glowAt(p[0], p[1] - 3, 30, col, 0.7); disc([p[0], p[1] - 3], 5, 5, col, '#FFFFFF', 1);
  },
  dock: function (s, T, live, g) {
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? '#0C0818' : rgba('#FF5C3A', 0.9)); }
    const c = tp(s, 0.5, 0.5), g2 = ctx.createLinearGradient(0, c[1] - 70, 0, c[1]); g2.addColorStop(0, rgba('#FF5C3A', 0)); g2.addColorStop(1, rgba('#FF5C3A', 0.4));
    ctx.fillStyle = g2; ctx.fillRect(c[0] - 16, c[1] - 70, 32, 70); seg([c[0] - 16, c[1]], [c[0] - 16, c[1] - 70], rgba('#FF8A5C', 0.6), 1); seg([c[0] + 16, c[1]], [c[0] + 16, c[1] - 70], rgba('#FF8A5C', 0.6), 1);
    for (let i = 0; i < 3; i++) { const ph = (T * 0.9 + i / 3) % 1, y = c[1] - 8 - ph * 55; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = '#FFB38A'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(c[0] - 8, y); ctx.lineTo(c[0], y - 5); ctx.lineTo(c[0] + 8, y); ctx.stroke(); } ctx.globalAlpha = 1;
  }
};
function vend(x, y, T) {
  box(x + 0.2, y + 0.2, 0.6, 0.6, 30, '#1A1230', 0); lrectP(x, y); const p = P(x + 0.5, y + 0.8, 18); glowAt(p[0], p[1], 20, '#18E6FF', 0.35);
}
function lrectP(x, y) { poly([P(x + 0.3, y + 0.8, 26), P(x + 0.7, y + 0.8, 26), P(x + 0.7, y + 0.8, 6), P(x + 0.3, y + 0.8, 6)], '#0A3A4A', '#18E6FF', 1); [10, 15, 20].forEach(function (z, i) { seg(P(x + 0.34, y + 0.8, z), P(x + 0.66, y + 0.8, z), [ '#FF2BD6', '#FFE14D', '#39FF9C'][i], 1.6); }); }
function canister(x, y, T) {
  [[0.35, 0.35], [0.68, 0.68]].forEach(function (b, i) { const p = P(x + b[0], y + b[1]); cyl(p, 7, 16, '#1A2A24', '#2A3F36'); glowAt(p[0], p[1] - 8, 16, '#39FF9C', 0.4 + 0.15 * Math.sin(T * 3 + i)); seg([p[0] - 7, p[1] - 9], [p[0] + 7, p[1] - 9], '#39FF9C', 1.6); });
}
export default {
  name: 'Cyberpunk', fonts: { d: 'Chakra Petch', b: 'Chakra Petch', df: 'sans-serif', bf: 'sans-serif' }, fs: { lab: 0.9, chip: 0.98 },
  ui: { bg: '#06020F', surface: '#0E0820', ink: '#F2E9FF', ink2: '#A596C8', line: '#2A1E4A', accent: '#FF2BD6', onAccent: '#13001A', rad: 0, cssRad: '0px', upper: 1, ls: '.1em', glow: 1, h1: 'clamp(24px,5.5vw,38px)', stageBg: '#06020F',
    bodyBg: 'radial-gradient(ellipse at 15% -10%, rgba(255,43,214,.16), transparent 55%), radial-gradient(ellipse at 100% 10%, rgba(24,230,255,.12), transparent 50%)', stageBorder: '#FF2BD6', stageShadow: '0 0 30px rgba(255,43,214,.35), inset 0 0 50px rgba(0,0,0,.6)' },
  pal: { floorA: '#110C22', floorB: '#0C0818', slab: '#1A1430', line: '#2A1E4A', ink: '#F2E9FF', ink2: '#A596C8', surface: '#0E0820', hat: '#FFE14D', skin: '#E8BE98', ok: '#39FF9C', bad: '#FF3B6B', warn: '#FFD23F', glow: '#FF2BD6',
    st: { plan: '#FF2BD6', library: '#18E6FF', bench: '#FFB800', terminal: '#39FF9C', tests: '#7CFF4D', dock: '#FF5C3A' }, ag: ['#FF3B6B', '#18E6FF', '#B66BFF', '#FFE14D', '#39FF9C'] },
  floor: { kind: 'checker', inset: 1, insetA: 0.4, grid: 0.4, gridCol: '#B24BFF', pad: 'neon', thick: 14, lane: '#18E6FF', entry: ['#FF2BD6', '#0A0618'], halo: 0.5 },
  base: { k: 0.82, c: '#05020C', trim: 1 }, vig: 0.65, vigCol: '#02000A', spark: '#FFE14D', fx: fx,
  txt: {
    title: 'Néon · Agents', arrive: 'ENTRÉE', noun: 'hacker',
    sub: "Chaque agent IA est un runner de la mégalopole. Il se rend au poste qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un poste ou un runner pour comprendre.",
    aria: "Mégalopole cyberpunk isométrique sous la pluie : des runners représentent des agents IA et se déplacent entre les postes.",
    zones: {
      plan: ['CONTRATS', 'Borne de contrats', "L'agent planifie ses contrats : il met à jour sa liste de tâches ou sous-traite une mission à un autre runner (sous-agent)."],
      library: ['DONNÉES', 'Banque de données', "L'agent aspire des données : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['MODS', 'Atelier de mods', "L'agent modifie ou crée des fichiers. C'est ici que le code est soudé, patché et amélioré."],
      terminal: ['DECK', 'Deck de piratage', "L'agent lance des commandes dans le terminal : compiler, installer des paquets, utiliser git."],
      tests: ['SIMULATION', 'Cabine de simulation', "L'agent lance les tests en simulation. Le témoin devient vert si les tests réussissent, rouge s'ils échouent."],
      dock: ['EXFIL', "Zone d'exfiltration", "Les agents qui ont fini leur mission sont téléportés hors de la zone par le faisceau d'extraction."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: vend, b: canister }, tall: 34,
  pants: function () { return '#161022'; }, boots: '#FF2BD6',
  back: function (f, K, bob, col, T, mv) { seg([f[0] - 8 * K, f[1] - 18 * K - bob], [f[0] - 8 * K, f[1] - 10 * K - bob], '#18E6FF', 1.4 * K); },
  torso: function (f, K, bob, col) { ctx.fillStyle = '#18E6FF'; ctx.fillRect(f[0] - 6 * K, f[1] - 17 * K - bob, 12 * K, 1.2 * K); ctx.fillStyle = '#FF2BD6'; ctx.fillRect(f[0] - 0.7 * K, f[1] - 19 * K - bob, 1.4 * K, 13 * K); },
  gear: function (f, K, bob, col, T) {
    const y = f[1] - 25 * K - bob, pk = ['#FF2BD6', '#18E6FF', '#FFE14D'][Math.floor(f[0]) % 3];
    [[-3, 7], [0, 10], [3, 7]].forEach(function (s, i) { poly([[f[0] + (s[0] - 1.4) * K, y - 4 * K], [f[0] + (s[0] + 1.4) * K, y - 4 * K], [f[0] + s[0] * K, y - s[1] * K - 4 * K]], pk); });
    glowAt(f[0], y - 0.5 * K, 12 * K, '#18E6FF', 0.5); ctx.fillStyle = '#0A0618'; ctx.fillRect(f[0] - 6 * K, y - 2.2 * K, 12 * K, 3.8 * K); ctx.fillStyle = '#18E6FF'; ctx.fillRect(f[0] - 5.4 * K, y - 1 * K, 10.8 * K, 1.4 * K);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(f[0] - 5.4 * K + ((T * 8) % 10.8) * K, y - 1 * K, 1.2 * K, 1.4 * K);
  }
};
