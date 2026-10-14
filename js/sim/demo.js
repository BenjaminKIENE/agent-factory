// Mode démo : génère des sessions d'agents réalistes (lectures, éditions, tests, sous-agents).

import { pick, rnd } from '../core/util.js';
import { enqueue, onEvent, reset, warm } from './simulation.js';
import { app } from '../store.js';

const MISSIONS = ['corriger la connexion expirée', 'ajouter la page de facturation', 'migrer la base de données', "écrire les tests de l'API", 'accélérer le chargement des pages'];

function buildSession(startAt, id, name, mission) {
  let t = startAt;
  function add(dt, ev, agent) { t += dt; enqueue(t, Object.assign({ agent_id: agent || id }, ev)); }
  function step(agent, tool, input, dur, extra) {
    add(rnd(450, 1000), { event: 'PreToolUse', tool: tool, input: input }, agent);
    add(dur, Object.assign({ event: 'PostToolUse', tool: tool }, extra || {}), agent);
  }
  const files = ['src/auth/session.ts', 'api/UsersController.cs', 'src/app/billing.component.ts', 'db/migrations/042.sql'];
  add(0, { event: 'SessionStart', name: name, mission: mission });
  step(id, 'TodoWrite', 'plan de la tâche', rnd(1100, 1700));
  step(id, 'Read', pick(files), rnd(1000, 1700));
  step(id, 'Grep', pick(['refreshToken', 'TODO', 'NHibernate', 'useEffect']), rnd(900, 1400));
  if (Math.random() < 0.75) {
    const sid = id + '-s';
    add(rnd(400, 800), { event: 'PreToolUse', tool: 'Task', input: 'relecture du module' });
    add(250, { event: 'SubagentStart', name: pick(['relecteur', 'chercheur']), parent_id: id, mission: pick(['relire le module modifié', 'chercher où le code est utilisé']) }, sid);
    step(sid, 'Read', pick(files), rnd(1000, 1500));
    step(sid, 'Grep', pick(['refreshToken', 'TODO', 'useEffect']), rnd(900, 1300));
    step(sid, 'Read', pick(files), rnd(1000, 1500));
    add(rnd(500, 900), { event: 'SubagentStop' }, sid);
    add(150, { event: 'PostToolUse', tool: 'Task' });
  }
  const edits = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < edits; i++) step(id, Math.random() < 0.5 ? 'Edit' : 'Write', pick(files), rnd(1800, 2800));
  step(id, 'Bash', 'npm run build', rnd(1500, 2500));
  if (Math.random() < 0.6) {
    step(id, 'Bash', 'npm test', rnd(2200, 3200), { result: 'fail' });
    step(id, 'Edit', pick(files), rnd(1600, 2400));
  }
  step(id, 'Bash', 'npm test', rnd(2200, 3200), { result: 'pass' });
  add(rnd(500, 800), { event: 'Notification', message: 'Autorisation demandée : git commit' });
  add(rnd(2200, 3000), { event: 'PreToolUse', tool: 'Bash', input: 'git commit -m "fix"' });
  add(rnd(1000, 1500), { event: 'PostToolUse', tool: 'Bash' });
  add(rnd(400, 800), { event: 'Stop' });
}
export function enqueueSession(at) {
  app.agentCounter += 1;
  const id = 'a' + app.agentCounter;
  app.autoIds.add(id);
  buildSession(at, id, 'Agent ' + app.agentCounter, MISSIONS[(app.agentCounter - 1) % MISSIONS.length]);
}

/** Remplace la scène par la démo : deux agents qui démarrent à quelques secondes d'écart. */
export function startDemo() {
  reset(); app.mode = 'sim';
  enqueueSession(300); enqueueSession(5200);
  warm();
  app.hover = null;
}

// Quand une session de démo se termine, on en relance une autre un peu plus tard.
onEvent(function (ev) {
  if (ev.event === 'Stop' && app.mode === 'sim' && app.autoIds.has(ev.agent_id)) {
    app.autoIds.delete(ev.agent_id);
    enqueueSession(app.simTime + 6500);
  }
});
