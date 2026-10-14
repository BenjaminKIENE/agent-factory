// Petites fonctions utilitaires sans dépendance.

export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function rnd(a, b) { return a + Math.random() * (b - a); }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
