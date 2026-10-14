// Boutons de l'en-tête : pause, vitesse, ajout d'un agent, retour à la démo.

import { app } from '../store.js';
import { $ } from './dom.js';
import { renderPanels } from './panels.js';
import { restartDemo } from './session.js';
import { disconnectLive } from '../io/live.js';
import { enqueueSession } from '../sim/demo.js';

export function initControls() {
  $('btnPlay').addEventListener('click', function () {
    app.playing = !app.playing;
    this.textContent = app.playing ? 'Pause' : 'Reprendre';
  });

  document.querySelectorAll('[data-speed]').forEach(function (b) {
    b.addEventListener('click', function () {
      app.speed = Number(b.getAttribute('data-speed'));
      document.querySelectorAll('[data-speed]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
    });
  });

  $('btnAdd').addEventListener('click', function () {
    if (app.mode !== 'sim') { disconnectLive(); restartDemo(); return; }
    if (app.autoIds.size < 5) { enqueueSession(app.simTime + 200); renderPanels(); }
  });

  $('btnSim').addEventListener('click', function () { disconnectLive(); restartDemo(); });
}
