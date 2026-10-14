// Tests de la géométrie : recherche de chemin autour des zones.
import test from 'node:test';
import assert from 'node:assert/strict';
import { STATIONS, N, BLOCK as blocked, findPath } from '../js/core/world.js';

test('le chemin arrive exactement à la destination', () => {
  const path = findPath(4.5, 8.5, 5.5, 4.5);
  assert.deepEqual(path[path.length - 1], [5.5, 4.5]);
});

test('le chemin ne traverse aucune zone ni aucun décor', () => {
  const path = findPath(4.5, 9.8, 1.5, 2.5);
  path.slice(0, -1).forEach(([x, y]) => assert.ok(!blocked.has(Math.floor(x) + ',' + Math.floor(y)), 'case bloquée : ' + x + ',' + y));
});

test('chaque créneau de travail est dans la grille et hors des zones', () => {
  STATIONS.forEach((s) => s.slots.forEach(([x, y]) => {
    assert.ok(x >= 0 && y >= 0 && x < N && y < N, s.id + ' hors grille');
    assert.ok(!blocked.has(Math.floor(x) + ',' + Math.floor(y)), s.id + ' : créneau sur une zone bloquée');
  }));
});
