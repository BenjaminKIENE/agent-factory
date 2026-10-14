// Aides DOM communes.

export const $ = function (id) { return document.getElementById(id); };
export function fmtTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Affiche un message d'état (normal ou erreur) dans l'élément d'identifiant `id`. */
export function setStatus(id, text, isErr) {
  const m = $(id);
  m.textContent = text;
  m.className = 'msg' + (isErr ? ' err' : '');
}
