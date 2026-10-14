// Géométrie de la scène : grille, zones (stations), décor, points d'attente et recherche de chemin.
// Rien ici ne dépend du dessin ni du DOM.

import { clamp } from './util.js';

export const N = 9, TW = 64, TH = 32, OY = 84, WH = 74;
export const W0 = N * TW + 60, H0 = 400, OX = W0 / 2;
export const STATIONS = [
  { id: 'plan', label: 'MISSION', name: 'Centre de mission',
    desc: "L'agent organise la mission : il met à jour sa liste de tâches ou confie une sous-mission à un autre astronaute (sous-agent).",
    tools: 'TodoWrite, Task',
    x: 1, y: 1, w: 2, d: 1, h: 42, slots: [[1.5, 2.5], [2.5, 2.5], [3.5, 1.5]] },
  { id: 'library', label: 'ARCHIVES', name: 'Archives de bord',
    desc: "L'agent consulte les archives : il lit des fichiers et cherche dans le code (ou sur le web) avant d'agir.",
    tools: 'Read, Grep, Glob, WebSearch, WebFetch',
    x: 5.5, y: 0.8, w: 2.5, d: 1, h: 52, slots: [[5.5, 2.5], [6.5, 2.5], [7.5, 2.5], [8.5, 1.5]] },
  { id: 'bench', label: 'ATELIER', name: 'Atelier de construction',
    desc: "L'agent modifie ou crée des fichiers. C'est ici que le code de la station change vraiment.",
    tools: 'Edit, Write, MultiEdit, NotebookEdit',
    x: 3, y: 3, w: 2, d: 2, h: 16, slots: [[3.5, 5.5], [4.5, 5.5], [5.5, 3.5], [5.5, 4.5]] },
  { id: 'terminal', label: 'CONSOLE', name: 'Console de commande',
    desc: "L'agent lance des commandes dans le terminal : compiler le projet, installer des paquets, utiliser git.",
    tools: 'Bash',
    x: 7, y: 5, w: 1, d: 1, h: 36, slots: [[8.5, 5.5], [7.5, 6.5], [8.5, 6.5]] },
  { id: 'tests', label: 'ESSAIS', name: 'Laboratoire d\'essais',
    desc: "L'agent lance les tests pour vérifier que tout fonctionne. La lampe devient verte si les tests réussissent, rouge s'ils échouent.",
    tools: 'Bash avec test, jest, vitest ou pytest dans la commande',
    x: 1, y: 5, w: 2, d: 1, h: 16, slots: [[1.5, 6.5], [2.5, 6.5], [0.5, 5.5], [3.5, 6.5]] },
  { id: 'dock', label: 'SAS', name: 'Sas de sortie',
    desc: "Les agents qui ont fini leur mission passent ici avant de quitter la station.",
    tools: 'Stop, SubagentStop',
    x: 0, y: 2, w: 1, d: 2, h: 8, slots: [[1.5, 3.5], [1.5, 4.5], [0.5, 4.5]] }
];
// Décor : une case chacun, hors des créneaux des ouvriers
export const PROPS = [
  { id: 'p1', prop: true, kind: 'crates', x: 0, y: 0, w: 1, d: 1, h: 28 },
  { id: 'p2', prop: true, kind: 'crates', x: 4, y: 0, w: 1, d: 1, h: 28 },
  { id: 'p3', prop: true, kind: 'barrels', x: 8, y: 3, w: 1, d: 1, h: 18 },
  { id: 'p4', prop: true, kind: 'crates', x: 0, y: 7, w: 1, d: 1, h: 28 },
  { id: 'p5', prop: true, kind: 'barrels', x: 8, y: 8, w: 1, d: 1, h: 18 }
];
export const LOBBY = [[4.5, 8.5], [3.5, 8.5], [5.5, 8.5], [2.5, 8.5], [6.5, 8.5]];
export const ORDERED = STATIONS.concat(PROPS).sort(function (a, b) { return (a.x + a.y + a.w + a.d) - (b.x + b.y + b.w + b.d); });
export const TOKEN = { plan: '--st-plan', library: '--st-read', bench: '--st-write', terminal: '--st-term', tests: '--st-test', dock: '--st-dock' };
export function stationById(id) { return STATIONS.filter(function (s) { return s.id === id; })[0]; }

export const BLOCK = new Set();
STATIONS.concat(PROPS).forEach(function (s) {
  for (let cx = Math.floor(s.x); cx <= Math.ceil(s.x + s.w) - 1; cx++)
    for (let cy = Math.floor(s.y); cy <= Math.ceil(s.y + s.d) - 1; cy++) BLOCK.add(cx + ',' + cy);
});

/** Plus court chemin (BFS 4 directions) entre deux points de la grille, en contournant les zones. Renvoie les points à suivre. */
export function findPath(sx, sy, tx, ty) {
  const s = [clamp(Math.floor(sx), 0, N - 1), clamp(Math.floor(sy), 0, N - 1)];
  const t = [clamp(Math.floor(tx), 0, N - 1), clamp(Math.floor(ty), 0, N - 1)];
  if (s[0] === t[0] && s[1] === t[1]) return [[tx, ty]];
  const key = function (c) { return c[0] + ',' + c[1]; };
  const prev = {}; prev[key(s)] = null;
  const q = [s];
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let found = false;
  while (q.length && !found) {
    const c = q.shift();
    for (let i = 0; i < 4; i++) {
      const n = [c[0] + dirs[i][0], c[1] + dirs[i][1]];
      if (n[0] < 0 || n[1] < 0 || n[0] >= N || n[1] >= N) continue;
      if (BLOCK.has(key(n)) || prev[key(n)] !== undefined) continue;
      prev[key(n)] = c; q.push(n);
      if (n[0] === t[0] && n[1] === t[1]) { found = true; break; }
    }
  }
  if (!found) return [[tx, ty]];
  const cells = [];
  let cur = t;
  while (cur && !(cur[0] === s[0] && cur[1] === s[1])) { cells.unshift(cur); cur = prev[key(cur)]; }
  const pts = cells.slice(0, -1).map(function (c) { return [c[0] + 0.5, c[1] + 0.5]; });
  pts.push([tx, ty]);
  return pts;
}

// Projection isométrique : coordonnées de grille (x, y) et hauteur z -> pixels du canevas.
export function P(x, y, z) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2 - (z || 0)]; }
