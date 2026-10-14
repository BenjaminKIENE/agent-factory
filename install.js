#!/usr/bin/env node
'use strict';
/*
 * Branche (ou débranche) Usine d'Agents sur Claude Code, sans copier-coller.
 *
 *   node hook/install.js            ajoute les hooks dans ~/.claude/settings.json
 *   node hook/install.js --remove   les retire
 *   node hook/install.js <fichier>  utilise un autre fichier settings.json
 *
 * Sûr à relancer : nos entrées sont repérées par le drapeau « --agent-factory » dans la commande,
 * donc rien n'est dupliqué et vos autres hooks ne sont pas touchés. Une copie de sauvegarde
 * (settings.json.agent-factory.bak) est faite avant la première modification.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const MARK = '--agent-factory';
const args = process.argv.slice(2);
const remove = args.indexOf('--remove') >= 0;
const custom = args.filter(function (a) { return a.indexOf('--') !== 0; })[0];
const file = custom ? path.resolve(custom) : path.join(os.homedir(), '.claude', 'settings.json');

const command = 'node "' + path.resolve(__dirname, 'hook.js') + '" ' + MARK;
const EVENTS = { SessionStart: false, PreToolUse: true, PostToolUse: true, Notification: false, Stop: false };   // true = avec matcher « * »

const isOurs = function (group) {
  return group && Array.isArray(group.hooks) && group.hooks.some(function (h) { return h && typeof h.command === 'string' && h.command.indexOf(MARK) >= 0; });
};

function fail(msg) { console.error('\nErreur : ' + msg); process.exit(1); }

// 1) lire le fichier existant (sans jamais écraser un fichier illisible)
let settings = {};
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, 'utf8');
  if (raw.trim()) {
    try { settings = JSON.parse(raw); } catch (e) { fail(file + " n'est pas un JSON valide (" + e.message + "). Rien n'a été modifié."); }
  }
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) fail(file + ' a un format inattendu. Rien n\'a été modifié.');
}
if (settings.hooks !== undefined && (typeof settings.hooks !== 'object' || settings.hooks === null || Array.isArray(settings.hooks))) {
  fail('la clé "hooks" de ' + file + ' a un format inattendu. Rien n\'a été modifié.');
}

// 2) retirer d'abord nos anciennes entrées (dossier déplacé, réinstallation…), puis ajouter si besoin
settings.hooks = settings.hooks || {};
Object.keys(settings.hooks).forEach(function (ev) {
  if (!Array.isArray(settings.hooks[ev])) return;
  settings.hooks[ev] = settings.hooks[ev].filter(function (g) { return !isOurs(g); });
  if (!settings.hooks[ev].length) delete settings.hooks[ev];
});
if (!remove) {
  Object.keys(EVENTS).forEach(function (ev) {
    const group = { hooks: [{ type: 'command', command: command }] };
    if (EVENTS[ev]) group.matcher = '*';
    settings.hooks[ev] = (settings.hooks[ev] || []).concat([group]);
  });
}
if (!Object.keys(settings.hooks).length) delete settings.hooks;

// 3) sauvegarde puis écriture
fs.mkdirSync(path.dirname(file), { recursive: true });
const backup = file + '.agent-factory.bak';
if (fs.existsSync(file) && !fs.existsSync(backup)) fs.copyFileSync(file, backup);
fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');

console.log(remove ? 'Claude Code est débranché.' : 'Claude Code est branché sur Usine d\'Agents.');
console.log('Fichier modifié : ' + file);
if (fs.existsSync(backup)) console.log('Sauvegarde de l\'original : ' + backup);
console.log(remove ? '' : '\nRedémarrez Claude Code (ou ouvrez /hooks), puis donnez-lui une tâche.');
