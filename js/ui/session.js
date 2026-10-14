// Relance la démo ET rafraîchit l'interface (utilisé par les boutons et la déconnexion du direct).

import { startDemo } from '../sim/demo.js';
import { renderPanels } from './panels.js';
import { updateTip } from './tooltip.js';
import { setStatus } from './dom.js';

export function restartDemo() {
  startDemo();
  renderPanels();
  updateTip();
  setStatus('replayMsg', '', false);
}
