// Thème « Station spatiale » : palette, interface, textes et tout le dessin propre à ce décor.
// Pour créer un thème, copiez ce fichier, modifiez-le, puis ajoutez-le dans themes/index.js.

import { REDUCED } from '../config.js';
import { clamp } from '../core/util.js';
import { H0, N, P, W0 } from '../core/world.js';
import { C, ctx } from '../render/canvas.js';
import { box, disc, glowAt, lline, lrect, mix, poly, rgba, rt, seg, tp, vgrad, wq } from '../render/draw-kit.js';
import { app } from '../store.js';

let STARS = null;
function bg(T) {
  vgrad(0, H0, [[0, '#000106'], [0.55, '#03051A'], [1, '#070418']]);
  glowAt(130, 130, 240, '#8A3FB0', 0.07); glowAt(W0 - 150, 330, 260, '#2FB8C8', 0.05);
  if (!STARS) {
    let sd = 7; const r = function () { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    STARS = [];
    for (let i = 0; i < 190; i++) STARS.push({ x: r() * W0, y: r() * H0, r: 0.4 + r() * 1.1, ph: r() * 6.28, sp: 0.6 + r() * 2, c: r() < 0.18 ? '#9FC4FF' : r() < 0.12 ? '#FFD9A0' : '#FFFFFF' });
  }
  STARS.forEach(function (st) { ctx.globalAlpha = clamp(0.45 + 0.5 * Math.sin(T * st.sp + st.ph) * 0.5 + 0.25, 0.12, 0.9); ctx.fillStyle = st.c; ctx.fillRect(st.x, st.y, st.r * 1.6, st.r * 1.6); });
  ctx.globalAlpha = 1;
  const px = W0 - 118, py = 92, R = 132;
  glowAt(px, py, R * 1.5, '#4FA8FF', 0.1);
  ctx.save(); ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.clip();
  const pg = ctx.createRadialGradient(px - R * 0.45, py - R * 0.4, R * 0.1, px, py, R * 1.05);
  pg.addColorStop(0, '#3A6FB0'); pg.addColorStop(0.45, '#102C60'); pg.addColorStop(1, '#02050F');
  ctx.fillStyle = pg; ctx.fillRect(px - R, py - R, R * 2, R * 2);
  ctx.globalAlpha = 0.2; ctx.fillStyle = '#FFFFFF';
  [[-0.5, -0.2, 0.7, 0.07], [-0.2, 0.15, 0.9, 0.06], [-0.6, 0.45, 0.6, 0.05], [0.05, -0.55, 0.5, 0.05]].forEach(function (b, i) {
    ctx.beginPath(); ctx.ellipse(px + b[0] * R + Math.sin(T * 0.05 + i) * 6, py + b[1] * R, b[2] * R, b[3] * R, -0.25, 0, 6.283); ctx.fill();
  });
  ctx.globalAlpha = 1;
  const sh = ctx.createRadialGradient(px - R * 0.5, py - R * 0.45, R * 0.4, px + R * 0.25, py + R * 0.25, R * 1.2);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,6,0.9)'); ctx.fillStyle = sh; ctx.fillRect(px - R, py - R, R * 2, R * 2);
  ctx.restore();
  ctx.beginPath(); ctx.arc(px, py, R, Math.PI * 0.9, Math.PI * 1.75); ctx.strokeStyle = 'rgba(110,180,240,0.55)'; ctx.lineWidth = 2; ctx.stroke();
  disc([104, 64], 17, 17, '#5E6778'); disc([110, 70], 15, 15, 'rgba(2,4,12,0.55)');
  const sx = REDUCED ? 260 : ((T * 7) % (W0 + 160)) - 80, sy = 58 + Math.sin(T * 0.2) * 5;
  poly([[sx - 14, sy], [sx + 6, sy - 3.5], [sx + 14, sy], [sx + 6, sy + 3.5]], '#C3CCDB', '#566178', 0.8);
  poly([[sx - 14, sy], [sx - 19, sy - 3], [sx - 19, sy + 3]], '#7F8CA3'); glowAt(sx - 20, sy, 12, '#7FD8FF', 0.8);
}
function walls(T) {
  const z = 18, g = C.glow;
  poly(wq(0, 0, N, 0, 0, z), rgba(g, 0.04), rgba(g, 0.4), 1); poly(wq(0, 0, 0, N, 0, z), rgba(g, 0.04), rgba(g, 0.4), 1);
  seg(P(0, 0, z), P(N, 0, z), rgba(g, 0.75), 1.8); seg(P(0, 0, z), P(0, N, z), rgba(g, 0.6), 1.8);
  for (let i = 0; i <= 3; i++) [[i * 3, 0], [0, i * 3]].forEach(function (c, k) {
    const b = P(c[0], c[1], 0), t = P(c[0], c[1], z + 12);
    seg(b, t, '#7E8DA8', 3.4); seg(b, t, '#B9C6DA', 1.4);
    const on = Math.sin(T * 3 + i + k * 2) > -0.2;
    glowAt(t[0], t[1], on ? 11 : 6, k ? C.warn : g, on ? 0.85 : 0.35); ctx.fillStyle = '#FFF'; ctx.fillRect(t[0] - 1, t[1] - 1, 2, 2);
  });
}
function edge(T, ph) {
  if (ph === 'under') {
    [[N, 1.8], [N, 6.8]].forEach(function (c, i) {
      const b = P(c[0], c[1], -9), fl = 1 + 0.2 * Math.sin(T * 14 + i * 3);
      glowAt(b[0] + 16, b[1] + 10, 30 * fl, '#5FC8FF', 0.3);
      poly([[b[0] - 5, b[1] - 5], [b[0] + 5, b[1] + 3], [b[0] + 30 * fl, b[1] + 18 * fl], [b[0] + 12, b[1] + 22 * fl]], rgba('#8FD8FF', 0.6));
      poly([[b[0] - 8, b[1] - 7], [b[0] + 4, b[1] + 5], [b[0] + 9, b[1] + 1], [b[0] - 1, b[1] - 10]], '#56637F', '#222C42', 1);
    });
  } else {
    seg(P(0, N, 0), P(N, N, 0), rgba(C.glow, 0.9), 1.6); seg(P(N, N, 0), P(N, 0, 0), rgba(C.glow, 0.7), 1.6);
    for (let i = 0; i < N; i++) { const q = P(i + 0.5, N, -7); ctx.fillStyle = Math.sin(T * 2 + i * 0.9) > -0.5 ? rgba(C.hat, 0.95) : rgba(C.hat, 0.25); ctx.fillRect(q[0] - 3, q[1] - 2, 6, 3.5); }
    for (let j = 0; j < N; j++) { const q = P(N, j + 0.5, -7); ctx.fillStyle = Math.sin(T * 2 + j * 1.3) > -0.4 ? rgba(C.glow, 0.9) : rgba(C.glow, 0.25); ctx.fillRect(q[0] - 3, q[1] - 2, 6, 3.5); }
  }
}
function hud(T, fs) {
  ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  ctx.font = '700 ' + (fs * 0.85) + "px 'Orbitron', sans-serif"; ctx.fillStyle = rgba(C.glow, 0.95); ctx.fillText('STATION ORBITE-7', 22, 20);
  ctx.font = '500 ' + (fs * 0.8) + "px 'IBM Plex Mono', monospace"; ctx.fillStyle = C.ink2;
  const sec = Math.floor(app.simTime / 1000);
  ctx.fillText('T+ ' + String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0') + '   ORBITE BASSE', 22, 20 + fs * 1.2);
  const nominal = app.state.tests.fail === 0 || app.state.lamps.tests === 'pass';
  ctx.fillStyle = nominal ? C.ok : C.bad; ctx.fillText(nominal ? '● SYSTÈMES NOMINAUX' : '● ANOMALIE DÉTECTÉE', 22, 20 + fs * 2.4);
}
const deco = {
  plan: function (s, T, live, g) {
    for (let i = 0; i < 3; i++) {
      const l = 0.7 + (live ? 0.5 * Math.abs(Math.sin(T * 2 + i * 1.7)) : 0.35);
      lline(s, 0.25, 0.25 + l, s.h - 9 - i * 9, rgba(g, 0.95), 2.2); lline(s, 0.25 + l + 0.1, 0.25 + l + 0.22, s.h - 9 - i * 9, rgba(C.hat, 0.9), 2.2);
    }
    const c = tp(s, 0.5, 0.5), top = [c[0], c[1] - 26];
    poly([[c[0] - 11, c[1]], [c[0] + 11, c[1]], [top[0] + 7, top[1]], [top[0] - 7, top[1]]], rgba(g, live ? 0.26 : 0.14));
    disc(c, 12, 5, rgba(g, 0.9)); glowAt(top[0], top[1], 30, g, live ? 0.6 : 0.35);
    ctx.strokeStyle = rgba('#CFF6FF', 0.95); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(top[0], top[1], 10, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.ellipse(top[0], top[1], 10, 3, 0, 0, 6.283); ctx.stroke();
    for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.ellipse(top[0], top[1], Math.max(1.5, 10 * Math.abs(Math.cos(T * 1.3 + i * 1.57))), 10, 0, 0, 6.283); ctx.stroke(); }
  },
  library: function (s, T, live, g) {
    for (let k = 0; k < 9; k++) {
      const u = 0.18 + k * 0.265, col = [C.glow, '#FF5FD0', C.hat][k % 3], a = 0.35 + 0.6 * Math.max(0, Math.sin(T * (live ? 4 : 1.2) + k * 1.3));
      lrect(s, u, u + 0.16, 7, s.h - 5, rgba(col, a));
    }
    [18, 32, 44].forEach(function (z) { lline(s, 0.08, s.w - 0.05, z, 'rgba(0,0,0,0.5)', 1.4); });
    const a = tp(s, 0.88, 0.3); seg(a, [a[0], a[1] - 12], '#9AA8C0', 1.6); glowAt(a[0], a[1] - 13, 7, Math.sin(T * 4) > 0 ? C.bad : C.ok, 0.9);
  },
  bench: function (s, T, live, g) {
    const b = tp(s, 0.5, 0.5);
    disc(b, 17, 8.5, 'rgba(0,0,0,0.45)'); disc([b[0], b[1] - 1], 17, 8.5, null, rgba(g, 0.9), 1.5);
    const a1 = live ? Math.sin(T * 2.2) * 0.7 : 0.25, a2 = live ? Math.sin(T * 3.1 + 1) * 0.9 + 0.7 : 0.9;
    const j1 = [b[0], b[1] - 4], j2 = [j1[0] + Math.sin(a1) * 15, j1[1] - Math.cos(a1) * 15], j3 = [j2[0] + Math.cos(a2 - 0.3) * 16, j2[1] + Math.sin(a2 - 0.3) * 8];
    seg(j1, j2, '#8896AE', 5); seg(j1, j2, '#C5D0E2', 2); seg(j2, j3, '#8896AE', 4); seg(j2, j3, '#C5D0E2', 1.6);
    [j1, j2].forEach(function (j) { disc(j, 3.2, 3.2, g); });
    seg(j3, [j3[0], j3[1] + 5], '#EEF3F8', 1.6);
    if (live) glowAt(j3[0], j3[1] + 6, 15, '#FFE19A', 0.55 + 0.4 * Math.abs(Math.sin(T * 30)));
    box(s.x + 1.25, s.y + 1.35, 0.5, 0.4, 6, mix(C.hat, '#000000', 0.3), s.h);
    lline(s, 0.2, 1.4, 6, rgba(g, 0.8), 1.6);
  },
  terminal: function (s, T, live, g) {
    lrect(s, 0.12, s.w - 0.12, 8, s.h - 5, '#050A14', rgba(g, 0.9), 1.2);
    for (let k = 0; k < 5; k++) {
      const hh = 4 + (live ? 14 * Math.abs(Math.sin(T * 4 + k * 1.9)) : 6 + (k % 3) * 3);
      lrect(s, 0.2 + k * 0.13, 0.29 + k * 0.13, 10, 10 + hh, rgba(k % 2 ? C.glow : C.ok, 0.95));
    }
    for (let k = 0; k < 3; k++) { const q = rt(s, 0.2 + k * 0.28, s.h - 8); glowAt(q[0], q[1], 5, [C.ok, C.warn, C.bad][k], Math.sin(T * 3 + k * 2) > -0.3 ? 0.95 : 0.3); }
    const ant = tp(s, 0.5, 0.5), ang = T * 2.4;
    seg(ant, [ant[0], ant[1] - 10], '#9AA8C0', 1.6); glowAt(ant[0], ant[1] - 11, 10, g, 0.6);
    seg([ant[0], ant[1] - 11], [ant[0] + Math.cos(ang) * 9, ant[1] - 11 + Math.sin(ang) * 4.5], '#FFF', 1.4);
  },
  tests: function (s, T, live, g) {
    const lamp = app.state.lamps.tests, cc = tp(s, 0.3, 0.5);
    ctx.fillStyle = rgba(g, 0.2 + (live ? 0.18 * Math.abs(Math.sin(T * 5)) : 0)); ctx.fillRect(cc[0] - 9, cc[1] - 24, 18, 24);
    disc(cc, 9, 4, ctx.fillStyle); disc([cc[0], cc[1] - 24], 9, 4, rgba('#CFF6FF', 0.5));
    ctx.strokeStyle = rgba('#CFF6FF', 0.8); ctx.lineWidth = 1; ctx.strokeRect(cc[0] - 9, cc[1] - 24, 18, 24);
    glowAt(cc[0], cc[1] - 12, 20, live ? C.warn : g, live ? 0.6 : 0.3);
    const p = tp(s, 0.75, 0.5, 9); let col = lamp === 'pass' ? C.ok : lamp === 'fail' ? C.bad : C.ink2;
    if (live && Math.floor(T * 4) % 2 === 0) col = C.warn;
    seg(tp(s, 0.75, 0.5), p, '#7E8DA8', 3);
    if (lamp || live) glowAt(p[0], p[1] - 3, 28, col, 0.6);
    disc([p[0], p[1] - 3], 6, 6, col, '#E6F1FF', 1);
    lline(s, 0.2, 1.6, 8, rgba(g, 0.85), 1.6);
  },
  dock: function (s, T, live, g) {
    for (let k = 0; k < 8; k++) { const y0 = s.y + k * (s.d / 8); poly([P(s.x + 0.04, y0, s.h), P(s.x + s.w - 0.04, y0, s.h), P(s.x + s.w - 0.04, y0 + s.d / 8, s.h), P(s.x + 0.04, y0 + s.d / 8, s.h)], k % 2 ? 'rgba(8,12,22,0.95)' : rgba(C.hat, 0.95)); }
    [0.15, s.d - 0.15].forEach(function (yy, i) {
      const b = P(s.x + 0.5, s.y + yy, s.h), top = [b[0], b[1] - 15]; seg(b, top, '#8896AE', 3);
      const on = Math.sin(T * 5 + i * 3.1) > 0; glowAt(top[0], top[1], on ? 18 : 8, C.warn, on ? 0.9 : 0.3); disc(top, 3.4, 3.4, on ? '#FFE9A8' : '#8A6A10');
    });
  }
};
function plant(x, y) {
  const p = P(x + 0.5, y + 0.5);
  [[-5, 0], [5, 2]].forEach(function (o, i) {
    const cx = p[0] + o[0], cy = p[1] + o[1];
    ctx.fillStyle = '#DDE3EA'; ctx.fillRect(cx - 4.5, cy - 20, 9, 20); disc([cx, cy], 4.5, 2.3, '#DDE3EA'); disc([cx, cy - 20], 4.5, 2.3, '#F4F7FA');
    ctx.fillStyle = i ? C.st.bench : C.st.plan; ctx.fillRect(cx - 4.5, cy - 12, 9, 4); ctx.fillStyle = C.ink2; ctx.fillRect(cx - 1.5, cy - 25, 3, 4);
  });
}
function pod(x, y, T) {
  box(x + 0.25, y + 0.25, 0.5, 0.5, 20, '#2A3552', 0); box(x + 0.3, y + 0.3, 0.4, 0.4, 7, '#5B8CFF', 20);
  const t = P(x + 0.5, y + 0.5, 30); glowAt(t[0], t[1], 8, C.ok, 0.8); disc(t, 2.4, 2.4, C.ok);
}
export default {
  name: 'Station spatiale', fonts: { d: 'Orbitron', b: 'Rajdhani' }, fs: { lab: 0.8, chip: 1.05 },
  ui: { bg: '#020309', surface: '#070C1A', ink: '#E6F1FF', ink2: '#8FA6C4', line: '#16213A', accent: '#4FE3FF', onAccent: '#03111A', rad: 2, cssRad: '2px', upper: 1, ls: '.08em', glow: 1, h1: 'clamp(22px,5vw,34px)', stageBg: '#04060F',
    bodyBg: 'radial-gradient(ellipse at 20% -10%, rgba(79,227,255,.10), transparent 55%), radial-gradient(ellipse at 100% 0%, rgba(181,140,255,.10), transparent 50%)', stageBorder: 'rgba(79,227,255,.55)', stageShadow: '0 0 34px rgba(79,227,255,.22), inset 0 0 60px rgba(0,0,0,.6)' },
  pal: { floorA: '#0F1526', floorB: '#0B101E', slab: '#1A2238', line: '#16213A', ink: '#E6F1FF', ink2: '#8FA6C4', surface: '#070C1A', hat: '#FFC93C', skin: '#E8BE98', ok: '#3EE07A', bad: '#FF5470', warn: '#FFC83D', glow: '#4FE3FF',
    st: { plan: '#5B8CFF', library: '#2DE0C4', bench: '#FFB347', terminal: '#B58CFF', tests: '#55E07A', dock: '#8FA3B8' }, ag: ['#FF6B4A', '#4DB2FF', '#C77DFF', '#FFD23F', '#FF5FA8'] },
  floor: { kind: 'checker', inset: 1, grid: 0.18, gridCol: '#4FE3FF', pad: 'neon', thick: 14, entry: ['#FFC93C', '#0A0E1A'] },
  base: { k: 0.78, c: '#05080F', trim: 1 }, vig: 0.72,
  txt: {
    title: 'Station Orbitale des Agents', arrive: 'AMARRAGE', noun: 'astronaute',
    sub: "Chaque agent IA est un astronaute de la station. Il se déplace vers le module qui correspond à ce qu'il est en train de faire. Survolez (ou touchez) un module ou un astronaute pour comprendre.",
    aria: "Station spatiale isométrique : des astronautes représentent des agents IA et circulent entre les modules.",
    zones: {
      plan: ['MISSION', 'Centre de mission', "L'agent organise la mission : il met à jour sa liste de tâches ou confie une sous-mission à un autre astronaute (sous-agent)."],
      library: ['ARCHIVES', 'Archives de bord', "L'agent consulte les archives : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir."],
      bench: ['ATELIER', 'Atelier de construction', "L'agent modifie ou crée des fichiers. C'est ici que le code de la station change vraiment."],
      terminal: ['CONSOLE', 'Console de commande', "L'agent lance des commandes dans le terminal : compiler le projet, installer des paquets, utiliser git."],
      tests: ['ESSAIS', "Laboratoire d'essais", "L'agent lance les tests pour vérifier que tout fonctionne. Le témoin devient vert si les tests réussissent, rouge s'ils échouent."],
      dock: ['SAS', 'Sas de sortie', 'Les agents qui ont fini leur mission passent ici avant de quitter la station.']
    } },
  bg: bg, walls: walls, edge: edge, hud: hud, deco: deco, props: { a: plant, b: pod },
  back: function (f, K, bob, col, T, mv) {
    ctx.fillStyle = '#8F9BB2'; ctx.fillRect(f[0] - 9 * K, f[1] - 19 * K - bob, 3.6 * K, 10 * K);
    if (mv && !REDUCED) { glowAt(f[0] - 7.5 * K, f[1] - 7 * K - bob, 9 * K, '#7FD8FF', 0.9); poly([[f[0] - 9 * K, f[1] - 9 * K - bob], [f[0] - 6 * K, f[1] - 9 * K - bob], [f[0] - 7.5 * K, f[1] - (3 + Math.random() * 3) * K - bob]], '#BFEFFF'); }
  },
  walkFx: function (f, K) { glowAt(f[0], f[1] + 1, 11 * K, '#7FD8FF', 0.5); },
  torso: function (f, K, bob) { ctx.fillStyle = '#EEF3F8'; ctx.fillRect(f[0] - 6 * K, f[1] - 19.5 * K - bob, 12 * K, 2.2 * K); },
  gear: function (f, K, bob) {
    const y = f[1] - 25 * K - bob;
    disc([f[0], y], 7.6 * K, 7.6 * K, 'rgba(120,200,255,0.30)', '#EEF3F8', 2.2 * K);
    ctx.beginPath(); ctx.arc(f[0] - 2.6 * K, y - 3 * K, 2.2 * K, Math.PI * 1.1, Math.PI * 1.7); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.2 * K; ctx.stroke();
    seg([f[0] + 5 * K, y - 6 * K], [f[0] + 7 * K, y - 10 * K], '#EEF3F8', 1.2 * K); disc([f[0] + 7 * K, y - 10.6 * K], 1.3 * K, 1.3 * K, C.bad);
  }
};
