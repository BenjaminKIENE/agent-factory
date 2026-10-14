// État partagé de l'application. Un seul objet mutable, importé là où on en a besoin :
// plus lisible que des variables globales, et on voit d'où vient chaque lecture/écriture.

export const app = {
  // --- simulation (modifié par sim/) ---
  state: null,          // état des agents (résultat de core/events.js reduce)
  queue: [],            // événements planifiés : { at (ms de simulation), ev }
  views: {},            // position/animation de chaque ouvrier, par id d'agent
  particles: [],        // étincelles et confettis
  simTime: 0,           // horloge de simulation en ms
  eventLog: [],         // journal complet (pour « Copier le journal »)
  agentCounter: 0,      // numérotation des agents de démo
  autoIds: new Set(),   // agents de démo encore en cours
  mode: 'sim',          // 'sim' (démo) | 'replay' | 'live'

  // --- interface (modifié par ui/) ---
  playing: true,
  speed: 1,
  hover: null,          // { kind: 'station' | 'worker', id } sous le pointeur
  ptr: null             // position du pointeur dans le canevas
};
