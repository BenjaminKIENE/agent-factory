// Registre des thèmes. Pour en ajouter un : créer js/themes/<id>.js (copier un thème existant), puis l'importer
// et le lister ci-dessous. Il apparaît tout seul dans la liste déroulante.
//
// Un thème est un objet. Champs lus par le moteur (render/scene.js, ui/theme-switcher.js) :
//
//   name            nom affiché dans la liste déroulante
//   fonts, fs       polices (d = titres, b = texte) et facteurs de taille des étiquettes/pastilles
//   ui              couleurs et style de la page HTML (devenus des variables CSS par applyTheme)
//   pal             palette du canevas : sol, encre, ok/bad/warn, couleur par zone (st), 5 couleurs d'agents (ag)
//   floor, base     style du sol (damier/planches/pavés, tapis des zones) et socle de la scène
//   txt             textes : titre, sous-titre, libellés et descriptions de chaque zone (zones[id] = [étiquette, nom, description])
//   bg(T)           fond (ciel, étoiles, mer…)             walls(T)  murs du fond
//   edge(T, phase)  bord de la scène, appelé avec 'under' puis 'over'
//   deco[zone](s, T, live, g)   dessin de chaque zone ; s = zone, live = quelqu'un y travaille, g = couleur de la zone
//   props{a, b}(x, y, T)        deux décors d'ambiance (caisses / tonneaux)
//   gear, back, torso, walkFx   accessoires des ouvriers (casque, sac à dos, effets de marche)
//   fx(T), hud(T, fs), vig      effets plein écran, affichage tête haute, vignette (facultatifs)
//
// T = temps d'animation en secondes. Les fonctions de dessin utilisent render/draw-kit.js.

import space from './space.js';
import factory from './factory.js';
import office from './office.js';
import medieval from './medieval.js';
import pirates from './pirates.js';
import cyberpunk from './cyberpunk.js';
import kitchen from './kitchen.js';
import lab from './lab.js';
import west from './west.js';
import abyss from './abyss.js';

export const THEMES = { space, factory, office, medieval, pirates, cyberpunk, kitchen, lab, west, abyss };
export const ORDER = Object.keys(THEMES);
export const DEFAULT_THEME = 'space';
ORDER.forEach(function (id) { THEMES[id].id = id; });
