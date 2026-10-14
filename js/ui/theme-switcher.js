// Applique un thème à toute la page : variables CSS, textes, légende, titre ; et alimente la liste déroulante.

import { THEME_KEY } from '../config.js';
import { STATIONS, TOKEN } from '../core/world.js';
import { canvas, setTheme } from '../render/canvas.js';
import { app } from '../store.js';
import { $ } from './dom.js';
import { buildLegend, renderPanels } from './panels.js';
import { updateTip } from './tooltip.js';
import { THEMES, ORDER } from '../themes/index.js';

function applyTheme(id) {
  const t = THEMES[id]; if (!t) return;
  setTheme(t);
  STATIONS.forEach(function (s) { const z = t.txt.zones[s.id]; s.label = z[0]; s.name = z[1]; s.desc = z[2]; });
  const u = t.ui, r = document.documentElement.style, set = function (k, v) { r.setProperty(k, v); };
  set('--bg', u.bg); set('--surface', u.surface); set('--ink', u.ink); set('--ink-2', u.ink2); set('--line', u.line); set('--accent', u.accent); set('--on-accent', u.onAccent);
  set('--rad', u.cssRad); set('--h-case', u.upper ? 'uppercase' : 'none'); set('--h-ls', u.ls); set('--h1-size', u.h1); set('--stage-bg', u.stageBg);
  set('--stage-border', u.stageBorder); set('--stage-shadow', u.stageShadow); set('--body-bg', u.bodyBg || 'none'); set('--corner-op', u.glow ? '1' : '0'); set('--h-glow', u.glow ? '0 0 18px ' + u.accent : 'none');
  set('--font-display', "'" + t.fonts.d + "', " + (t.fonts.df || 'sans-serif')); set('--font-body', "'" + t.fonts.b + "', " + (t.fonts.bf || 'sans-serif'));
  set('--ok', t.pal.ok); set('--bad', t.pal.bad); set('--warn', t.pal.warn);
  Object.keys(TOKEN).forEach(function (k) { set(TOKEN[k], t.pal.st[k]); });
  t.pal.ag.forEach(function (c, i) { set('--a' + (i + 1), c); });
  document.documentElement.style.colorScheme = (parseInt(u.bg.slice(1, 3), 16) < 100) ? 'dark' : 'light';
  document.title = t.txt.title;
  $('title').textContent = t.txt.title; $('sub').textContent = t.txt.sub; canvas.setAttribute('aria-label', t.txt.aria + ' Le détail de chaque zone est dans la section Zones et outils.');
  buildLegend(); app.hover = null; if (app.state) { updateTip(); renderPanels(); }
  if ($('themeSel').value !== id) $('themeSel').value = id;
  try { localStorage.setItem(THEME_KEY, id); } catch { /* stockage indisponible */ }
}

export function initThemes(initialId) {
  const sel = $('themeSel');
  ORDER.forEach(function (id) {
    const o = document.createElement('option');
    o.value = id; o.textContent = THEMES[id].name;
    sel.appendChild(o);
  });
  sel.addEventListener('change', function () { applyTheme(sel.value); });
  applyTheme(initialId);
}
