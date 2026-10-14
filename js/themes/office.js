// Thème « Boîte informatique » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { H0, N, P, TH, TW } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, disc, glowAt, hsh, lline, lrect, lt, mix, poly, rgba, rr, seg, tp, vgrad, wallPair, winW, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

function bg(T) {
  vgrad(0, H0, [[0, '#DCE8F4'], [1, '#EEF2F7']]);
  ctx.fillStyle = 'rgba(120,140,170,0.25)';
  for (let i = 0; i < 14; i++) { const x = i * 48 - 10, h = 40 + hsh(i, 3) * 70; ctx.fillRect(x, 120 - h, 34, h + 20); }
}
function walls() {
  wallPair('#E4E8EF', '#CBD2DD', 74, ['#C3CBD7', '#AEB7C5', '#B7C0CD', '#A0AAB9']);
  [0.4, 1.9, 5.7, 7.2].forEach(function (x) { winW('R', x, x + 1.2, 34, 64, '#BFE0F2', '#7B8798', 1); });
  [0.5, 2.2, 3.9, 5.6, 7.3].forEach(function (y) { winW('L', y, y + 1.2, 34, 64, '#A9D2EA', '#7B8798', 1); });
  poly(wq(3.3, 0, 5.5, 0, 33, 56), '#1F2A3A');
  ctx.save(); const o = P(3.5, 0, 40); ctx.translate(o[0], o[1]); ctx.transform(1, TH / TW, 0, 1, 0, 0);
  ctx.font = "700 10px 'Space Grotesk', sans-serif"; ctx.fillStyle = '#7FD8FF'; ctx.textAlign = 'left'; ctx.fillText('DEV & CO', 0, 0); ctx.restore();
  [1, 3.5, 6.5].forEach(function (x) { const a = P(x, 0, 72); glowAt(a[0], a[1], 18, '#FFFFFF', 0.5); });
}
function edge(T, ph) {
  if (ph !== 'over') return;
  seg(P(0, N, 0), P(N, N, 0), '#3F6FD6', 2.2); seg(P(N, N, 0), P(N, 0, 0), '#3F6FD6', 2.2);
}
const deco = {
  plan: function (s, T, live, g) {   // kanban
    [0.2, 0.7, 1.2].forEach(function (u, c) {
      lrect(s, u, u + 0.45, 6, s.h - 4, 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.35)', 0.8);
      for (let k = 0; k < 3 - (c === 2 ? 1 : 0); k++) lrect(s, u + 0.06, u + 0.39, 9 + k * 9, 15 + k * 9, [C.hat, '#FF8FB0', '#7FD8FF'][(k + c) % 3]);
    });
    const a = tp(s, 0.5, 0.5); disc(a, 6, 3, '#fff', '#3F6FD6', 1.2);
  },
  library: function (s, T, live, g) {
    for (let sh = 0; sh < 3; sh++) { const z = 8 + sh * 15; lline(s, 0.05, s.w - 0.05, z, mix(g, '#000', 0.5), 1.6); for (let k = 0; k < 7; k++) { const u = 0.15 + k * 0.33; lrect(s, u, u + 0.2, z, z + 10 + (k % 3) * 1.5, C.ag[(k + sh) % 5]); lline(s, u, u + 0.2, z + 6, 'rgba(255,255,255,0.7)', 1); } }
  },
  bench: function (s, T, live, g) {
    [0.2, 1.1].forEach(function (u, i) {
      const x0 = s.x + u, y0 = s.y + s.d - 0.15, z = s.h + 2;
      poly([P(x0, y0, z + 15), P(x0 + 0.7, y0, z + 15), P(x0 + 0.7, y0, z), P(x0, y0, z)], '#0A100E', '#2F3A4A', 1);
      for (let k = 0; k < 4; k++) { const w = live ? 0.2 + 0.4 * Math.abs(Math.sin(T * 3 + k * 1.7 + i)) : 0.3; seg(P(x0 + 0.08, y0, z + 12 - k * 3), P(x0 + 0.08 + w, y0, z + 12 - k * 3), [C.st.library, C.hat, C.ag[2], C.ok][k], 1.4); }
      seg(P(x0 + 0.35, y0, z), P(x0 + 0.35, y0, s.h), '#2F3A4A', 2);
    });
    box(s.x + 0.3, s.y + 0.3, 0.9, 0.35, 1.5, '#9AA6B8', s.h); box(s.x + 1.4, s.y + 0.35, 0.3, 0.3, 4, '#FFFFFF', s.h);
  },
  terminal: function (s, T, live, g) {
    for (let r = 0; r < 4; r++) {
      const z1 = s.h - 4 - r * 8, z0 = z1 - 6; lrect(s, 0.1, s.w - 0.1, z0, z1, '#0A100E', '#2F3A4A', 0.8);
      for (let l = 0; l < 3; l++) { const on = live ? Math.sin(T * 7 + r * 2 + l * 3) > 0 : (r + l) % 2 === 0, q = lt(s, 0.22 + l * 0.2, z0 + 3); ctx.fillStyle = on ? (l === 2 ? C.warn : C.ok) : '#33403C'; ctx.fillRect(q[0] - 1.2, q[1] - 1.2, 2.4, 2.4); }
    }
    const ant = tp(s, 0.5, 0.5); disc([ant[0], ant[1] - 3], 2.4, 2.4, live && Math.floor(T * 3) % 2 ? C.warn : C.ok);
  },
  tests: function (s, T, live, g) {
    const lamp = app.state.lamps.tests; let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : '#7C8799';
    if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    const p = tp(s, 0.5, 0.5, 9); seg(tp(s, 0.5, 0.5), p, '#3E4658', 3); if (lamp) glowAt(p[0], p[1] - 3, 26, col, 0.5); disc([p[0], p[1] - 3], 6, 6, col, '#1B2430', 1);
    for (let i = 0; i < 3; i++) lrect(s, 0.4 + i * 0.5, 0.7 + i * 0.5, 5, 10, mix(g, '#fff', 0.45));
  },
  dock: function (s, T, live, g) {
    const off = (T * 0.8) % 1;
    for (let k = 0; k < 3; k++) { const y = s.y + 0.2 + ((k + off) % 3) * (s.d / 3.2); poly([P(s.x + 0.15, y, s.h), P(s.x + 0.5, y + 0.2, s.h), P(s.x + 0.85, y, s.h), P(s.x + 0.5, y + 0.45, s.h)], rgba(C.ok, 0.4 + 0.5 * (1 - ((k + off) % 3) / 3))); }
  }
};
function plant(x, y) {
  const p = P(x + 0.5, y + 0.5);
  ctx.fillStyle = '#9A6B3F'; ctx.fillRect(p[0] - 6, p[1] - 9, 12, 9); disc(p, 6, 3, '#9A6B3F');
  [[-7, -20], [0, -27], [7, -19], [-3, -15], [4, -14]].forEach(function (l, i) { ctx.beginPath(); ctx.ellipse(p[0] + l[0], p[1] + l[1], 4.2, 8, (l[0] || 1) * 0.07, 0, 6.283); ctx.fillStyle = mix('#3A9A4B', i % 2 ? '#000' : '#fff', 0.18); ctx.fill(); });
}
function cooler(x, y) {
  box(x + 0.25, y + 0.25, 0.5, 0.5, 20, '#E6EEF5', 0); box(x + 0.3, y + 0.3, 0.4, 0.4, 7, '#7FC4FF', 20);
  const t = P(x + 0.5, y + 0.5, 30); disc(t, 3, 3, '#3A9A4B');
}
export default {
  name: 'Boîte informatique', fonts: { d: 'Space Grotesk', b: 'IBM Plex Sans' }, fs: { lab: 1.0, chip: 0.95 },
  ui: { bg: '#E7EBF1', surface: '#F5F7FA', ink: '#16202E', ink2: '#556277', line: '#C9D1DE', accent: '#3F6FD6', onAccent: '#FFFFFF', rad: 4, cssRad: '8px', upper: 0, ls: '-.01em', h1: 'clamp(30px,6vw,44px)', stageBg: '#F5F7FA', bodyBg: 'none', stageBorder: '#C3CCDA', stageShadow: '0 6px 24px rgba(40,60,100,.12)' },
  pal: { floorA: '#C9D1DC', floorB: '#BEC8D6', slab: '#9AA6B8', line: '#AAB4C4', ink: '#16202E', ink2: '#556277', surface: '#F5F7FA', hat: '#F2C230', skin: '#F0C9A4', ok: '#2E9B4F', bad: '#D23B3B', warn: '#E0A100', glow: '#3F6FD6',
    st: { plan: '#3F6FD6', library: '#1E9B8B', bench: '#D98B1A', terminal: '#7A5CD0', tests: '#3A9A4B', dock: '#6B7A80' }, ag: ['#D9472B', '#2B7CC0', '#9A5CC2', '#B89500', '#D14A8B'] },
  floor: { kind: 'checker', inset: 1, insetA: 0.1, grid: 0.4, pad: 'tape', thick: 12, lane: '#3F6FD6' }, base: { k: 0 },
  txt: {
    title: 'Open Space des Agents', arrive: 'ACCUEIL', noun: 'développeur',
    sub: "Chaque agent IA est un développeur de la boîte. Il se déplace vers la zone qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) une zone ou un développeur pour comprendre.",
    aria: "Bureaux d'une boîte informatique en vue isométrique : des développeurs représentent des agents IA et se déplacent entre les zones.",
    zones: {
      plan: ['SCRUM', 'Tableau Kanban', "L'agent organise son travail comme dans un sprint : il met à jour sa liste de tâches ou confie un ticket à un sous-agent."],
      library: ['DOCS', 'Documentation', "L'agent lit des fichiers et cherche dans le code (ou sur le web), comme un dev qui fouille la doc avant de toucher au code."],
      bench: ['DEV', 'Postes de dev', "L'agent modifie ou crée des fichiers, double écran devant lui. C'est ici que le code change vraiment."],
      terminal: ['SERVEURS', 'Salle serveurs', "L'agent lance des commandes dans le terminal : compiler le projet, installer des paquets, utiliser git."],
      tests: ['QA', 'Recette (QA)', "L'agent lance les tests pour vérifier que tout fonctionne. La lampe devient verte si les tests réussissent, rouge s'ils échouent."],
      dock: ['PROD', 'Mise en production', "Les agents qui ont fini leur mission livrent leur travail ici avant de quitter l'open space."]
    } },
  bg: bg, walls: walls, edge: edge, deco: deco, props: { a: plant, b: cooler },
  torso: function (f, K, bob) { ctx.fillStyle = '#fff'; ctx.fillRect(f[0] - 0.6 * K, f[1] - 19 * K - bob, 1.2 * K, 8 * K); ctx.fillStyle = '#3F6FD6'; ctx.fillRect(f[0] - 1.8 * K, f[1] - 11.4 * K - bob, 3.6 * K, 3 * K); },
  gear: function (f, K, bob, col, T, a, ol) {
    const y = f[1] - 26 * K - bob, hair = ['#2B1D14', '#6B4226', '#1A1A1F', '#8A5A2B', '#C9A24A'][(a.ci + (a.parentId ? 2 : 0)) % 5];
    ctx.beginPath(); ctx.arc(f[0], y, 5.8 * K, Math.PI, 0); ctx.closePath(); ctx.fillStyle = hair; ctx.fill(); ctx.strokeStyle = ol; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(f[0], y - 0.4 * K, 6.6 * K, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = '#1B2430'; ctx.lineWidth = 1.8 * K; ctx.stroke();
    ctx.fillStyle = '#1B2430'; rr(f[0] - 7.6 * K, y, 2.8 * K, 4.2 * K, 1); ctx.fill(); rr(f[0] + 4.8 * K, y, 2.8 * K, 4.2 * K, 1); ctx.fill();
  }
};
