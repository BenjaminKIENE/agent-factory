// Logique pure (aucun dessin, aucun DOM) : un événement de hook -> nouvel état des agents.
// C'est la partie la plus simple à tester : reduce(état, événement, maintenant) renvoie un nouvel état.

export const EXPIRE = 5000; // ms de simulation avant de retirer un agent terminé

const ACTION_LONG = {
  Read: 'Lit un fichier', Grep: 'Cherche dans le code', Glob: 'Liste des fichiers',
  Edit: 'Modifie un fichier', Write: 'Crée un fichier', MultiEdit: 'Modifie des fichiers', NotebookEdit: 'Modifie un notebook',
  TodoWrite: 'Met à jour sa liste de tâches', Task: 'Confie une mission à un sous-agent',
  WebSearch: 'Cherche sur le web', WebFetch: 'Lit une page web', Bash: 'Lance une commande'
};
const ACTION_SHORT = {
  Read: 'Lit', Grep: 'Cherche', Glob: 'Liste', Edit: 'Modifie', Write: 'Crée', MultiEdit: 'Modifie', NotebookEdit: 'Modifie',
  TodoWrite: 'Planifie', Task: 'Délègue', WebSearch: 'Cherche', WebFetch: 'Lit le web', Bash: 'Commande'
};
export function actionLong(tool, station) { return station === 'tests' ? 'Lance les tests' : (ACTION_LONG[tool] || ('Utilise ' + (tool || 'un outil'))); }
export function actionShort(tool, station) { return station === 'tests' ? 'Teste' : (ACTION_SHORT[tool] || tool || '?'); }
function lcFirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

/** Zone où un outil doit être « exécuté » : lecture -> archives, écriture -> atelier, Bash -> console ou tests… */
function stationFor(ev) {
  const t = ev.tool || '';
  if (['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch'].indexOf(t) >= 0) return 'library';
  if (['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].indexOf(t) >= 0) return 'bench';
  if (t === 'TodoWrite' || t === 'Task') return 'plan';
  if (t === 'Bash') return /\b(test|vitest|jest|pytest)\b/i.test(String(ev.input || '')) ? 'tests' : 'terminal';
  return 'terminal';
}

export function eventText(e) {
  switch (e.event) {
    case 'SessionStart': return 'démarre';
    case 'SubagentStart': return 'démarre comme sous-agent';
    case 'PreToolUse': return lcFirst(actionLong(e.tool, stationFor({ tool: e.tool, input: e.detail })));
    case 'PostToolUse': return 'a fini son action' + (e.result === 'pass' ? ' : tests réussis' : e.result === 'fail' ? ' : tests échoués' : '');
    case 'Notification': return 'demande une autorisation';
    case 'Stop':
    case 'SubagentStop': return 'a terminé sa mission';
    default: return e.event;
  }
}

export function emptyState() {
  return { agents: {}, order: [], lamps: { tests: null }, tests: { pass: 0, fail: 0 }, log: [] };
}

/**
 * Applique un événement à l'état et renvoie un NOUVEL état (l'ancien n'est pas modifié).
 * @param {object} s     état courant (voir emptyState)
 * @param {object} ev    { agent_id, event, tool?, input?, message?, result?, name?, mission?, parent_id? }
 * @param {number} now   horloge de simulation en ms
 */
export function reduce(s, ev, now) {
  const id = ev.agent_id;
  if (!id) return s;
  const agents = Object.assign({}, s.agents);
  let order = s.order, lamps = s.lamps, tests = s.tests;

  function get() {
    const prev = agents[id];
    if (prev) { agents[id] = Object.assign({}, prev); return agents[id]; }
    const parent = ev.parent_id ? agents[ev.parent_id] : null;
    const mains = order.filter(function (k) { return !agents[k].parentId; }).length;
    agents[id] = {
      id: id, name: ev.name || id, parentId: ev.parent_id || null, mission: ev.mission || '',
      ci: parent ? parent.ci : mains % 5,
      status: 'idle', station: null, tool: null, detail: '', since: now, doneAt: 0,
      n: { plan: 0, library: 0, bench: 0, terminal: 0, tests: 0 }
    };
    order = order.concat([id]);
    return agents[id];
  }

  const a = get();
  switch (ev.event) {
    case 'SessionStart':
    case 'SubagentStart':
      a.status = 'idle';
      if (ev.name) a.name = ev.name;
      if (ev.mission) a.mission = ev.mission;
      break;
    case 'PreToolUse': {
      const st = stationFor(ev);
      a.status = 'working'; a.station = st; a.tool = ev.tool || '?';
      a.detail = String(ev.input || '').slice(0, 60); a.since = now;
      a.n = Object.assign({}, a.n); a.n[st] = (a.n[st] || 0) + 1;
      break;
    }
    case 'PostToolUse':
      a.status = 'idle'; a.tool = null;
      if (a.station === 'tests' && (ev.result === 'pass' || ev.result === 'fail')) {
        lamps = { tests: ev.result };
        tests = Object.assign({}, tests); tests[ev.result] += 1;
      }
      break;
    case 'Notification':
      a.status = 'waiting'; a.detail = String(ev.message || '').slice(0, 60);
      break;
    case 'Stop':
    case 'SubagentStop':
      a.status = 'done'; a.station = 'dock'; a.tool = null; a.doneAt = now;
      break;
    default:
      break;
  }

  const entry = { t: now, name: a.name, event: ev.event, tool: ev.tool || '', result: ev.result || '', detail: String(ev.input || ev.message || '').slice(0, 60) };
  const log = [entry].concat(s.log).slice(0, 40);

  if (order.length > 30) {
    const keep = order.filter(function (k) { return agents[k].status !== 'done' || now - agents[k].doneAt < EXPIRE; });
    order.forEach(function (k) { if (keep.indexOf(k) < 0) delete agents[k]; });
    order = keep;
  }
  return { agents: agents, order: order, lamps: lamps, tests: tests, log: log };
}
