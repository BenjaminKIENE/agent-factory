// Le canevas et son contexte 2D, plus l'état de rendu lu par la scène et les thèmes
// (palette active, taille, temps d'animation). Les `export let` sont des liaisons « vivantes » :
// les autres modules lisent toujours la valeur courante, mais seul ce module les modifie.

import { W0, H0 } from '../core/world.js';
import { REDUCED } from '../config.js';

export const canvas = document.getElementById('scene');
export const stage = document.getElementById('stage');
export const ctx = canvas.getContext('2d');

export let theme = null;   // thème actif (objet de themes/*.js)
export let C = null;       // palette du thème actif (theme.pal)
export let cssW = 0, cssH = 0, dpr = 1, sc = 1;   // taille CSS du canevas, densité de pixels, échelle scène -> écran
export let animT = 0;      // temps d'animation en secondes (figé pendant la pause)

export function setTheme(t) { theme = t; C = t.pal; }
export function advanceAnim(dt) { animT += dt; }

/** Temps d'animation, ramené à 0 si l'utilisateur préfère réduire les animations. */
export function Tt(T) { return REDUCED ? 0 : T; }

export function FD() { return "'" + theme.fonts.d + "', " + (theme.fonts.df || 'sans-serif'); }
export function FB() { return "'" + theme.fonts.b + "', " + (theme.fonts.bf || 'sans-serif'); }

/** Adapte la résolution du canevas à la largeur disponible (écrans HiDPI inclus). */
export function resize() {
  const parent = canvas.parentElement;
  cssW = parent.clientWidth;
  if (!cssW) return;
  sc = cssW / W0;
  cssH = Math.round(cssW * H0 / W0);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.height = cssH + 'px';
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
}
