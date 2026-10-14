// Tests de la logique pure (aucun navigateur nécessaire) : npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, reduce, eventText } from '../js/core/events.js';

const run = (events) => events.reduce((s, ev, i) => reduce(s, ev, i * 1000), emptyState());

test('SessionStart crée un agent au repos', () => {
  const s = run([{ agent_id: 'a', event: 'SessionStart', name: 'Agent 1', mission: 'corriger un bug' }]);
  assert.equal(s.agents.a.name, 'Agent 1');
  assert.equal(s.agents.a.status, 'idle');
  assert.deepEqual(s.order, ['a']);
});

test('un outil de lecture envoie l\'agent aux archives', () => {
  const s = run([
    { agent_id: 'a', event: 'SessionStart' },
    { agent_id: 'a', event: 'PreToolUse', tool: 'Read', input: 'src/app.ts' }
  ]);
  assert.equal(s.agents.a.station, 'library');
  assert.equal(s.agents.a.status, 'working');
  assert.equal(s.agents.a.n.library, 1);
});

test('Bash avec « test » va au labo, sinon au terminal', () => {
  const t = run([{ agent_id: 'a', event: 'PreToolUse', tool: 'Bash', input: 'npm test' }]);
  const c = run([{ agent_id: 'a', event: 'PreToolUse', tool: 'Bash', input: 'npm run build' }]);
  assert.equal(t.agents.a.station, 'tests');
  assert.equal(c.agents.a.station, 'terminal');
});

test('le résultat des tests met à jour la lampe et les compteurs', () => {
  const s = run([
    { agent_id: 'a', event: 'PreToolUse', tool: 'Bash', input: 'jest' },
    { agent_id: 'a', event: 'PostToolUse', tool: 'Bash', result: 'fail' },
    { agent_id: 'a', event: 'PreToolUse', tool: 'Bash', input: 'jest' },
    { agent_id: 'a', event: 'PostToolUse', tool: 'Bash', result: 'pass' }
  ]);
  assert.deepEqual(s.tests, { pass: 1, fail: 1 });
  assert.equal(s.lamps.tests, 'pass');
});

test('Notification met l\'agent en attente, Stop l\'envoie au sas', () => {
  const w = run([{ agent_id: 'a', event: 'Notification', message: 'Autorisation : git commit' }]);
  assert.equal(w.agents.a.status, 'waiting');
  const d = run([{ agent_id: 'a', event: 'Stop' }]);
  assert.equal(d.agents.a.status, 'done');
  assert.equal(d.agents.a.station, 'dock');
});

test('un sous-agent hérite de la couleur de son parent', () => {
  const s = run([
    { agent_id: 'p', event: 'SessionStart' },
    { agent_id: 's', event: 'SubagentStart', parent_id: 'p' }
  ]);
  assert.equal(s.agents.s.parentId, 'p');
  assert.equal(s.agents.s.ci, s.agents.p.ci);
});

test('reduce ne modifie pas l\'état d\'origine (fonction pure)', () => {
  const before = run([{ agent_id: 'a', event: 'SessionStart' }]);
  const snapshot = JSON.stringify(before);
  reduce(before, { agent_id: 'a', event: 'PreToolUse', tool: 'Edit', input: 'x' }, 5000);
  assert.equal(JSON.stringify(before), snapshot);
});

test('un événement sans agent_id est ignoré', () => {
  const s0 = emptyState();
  assert.equal(reduce(s0, { event: 'Stop' }, 0), s0);
});

test('eventText décrit l\'événement en français', () => {
  assert.equal(eventText({ event: 'Stop' }), 'a terminé sa mission');
  assert.match(eventText({ event: 'PostToolUse', result: 'fail' }), /tests échoués/);
});
