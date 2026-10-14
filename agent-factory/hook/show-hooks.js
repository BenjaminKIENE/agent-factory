#!/usr/bin/env node
'use strict';
/* Affiche le bloc "hooks" à coller dans le settings.json de Claude Code, avec le bon chemin vers hook.js. */
const path = require('path');
const hookPath = path.resolve(__dirname, 'hook.js');
const cmd = 'node "' + hookPath + '"';
const entry = function (withMatcher) { const e = { hooks: [{ type: 'command', command: cmd }] }; if (withMatcher) e.matcher = '*'; return [e]; };
const hooks = { SessionStart: entry(false), PreToolUse: entry(true), PostToolUse: entry(true), Notification: entry(false), Stop: entry(false) };
console.log('Collez ce bloc dans votre fichier settings.json de Claude Code (clé "hooks"),');
console.log('par exemple %USERPROFILE%\\.claude\\settings.json. Si une clé "hooks" existe déjà, fusionnez les événements.\n');
console.log(JSON.stringify({ hooks: hooks }, null, 2));
