// Point d'entrée : assemble les modules, démarre la démo et la boucle d'animation.

import { app } from './store.js';
import { THEME_KEY } from './config.js';
import { THEMES, DEFAULT_THEME } from './themes/index.js';
import { canvas, resize, advanceAnim, animT } from './render/canvas.js';
import { draw } from './render/scene.js';
import { advance } from './sim/simulation.js';
import { initThemes } from './ui/theme-switcher.js';
import { initTooltip } from './ui/tooltip.js';
import { initControls } from './ui/controls.js';
import { renderPanels } from './ui/panels.js';
import { restartDemo } from './ui/session.js';
import { initReplay } from './io/replay.js';
import { initLive } from './io/live.js';

function savedTheme() {
  try {
    const id = localStorage.getItem(THEME_KEY);
    if (id && THEMES[id]) return id;
  } catch { /* stockage indisponible */ }
  return DEFAULT_THEME;
}

// Boucle d'animation : avance la simulation (sauf en pause) puis redessine.
let last = null;
export function frame(ts) {
  const dt = last === null ? 0 : Math.min(0.05, (ts - last) / 1000);
  last = ts;
  if (app.playing) { advanceAnim(dt); advance(dt * app.speed * 1000); }
  draw(animT);
  requestAnimationFrame(frame);
}

if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
window.addEventListener('resize', resize);

initTooltip();
initControls();
initReplay();
initThemes(savedTheme());
resize();
restartDemo();
initLive();

requestAnimationFrame(frame);
setInterval(renderPanels, 400);   // le temps écoulé et l'état des agents changent même sans événement
