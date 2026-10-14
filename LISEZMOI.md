# Usine d'Agents : visualiser votre IA en direct

Une scène isométrique (10 thèmes au choix) où chaque agent IA est un personnage qui se déplace selon l'outil qu'il utilise. Cette page se branche sur **Claude Code** grâce à ses *hooks*.

Tout reste sur votre ordinateur : le relais n'écoute que sur `127.0.0.1`.

## Installation (Windows, 3 minutes)

Prérequis : [Node.js](https://nodejs.org) 18 ou plus (vérifiez avec `node -v` dans un terminal).

1. **Lancer le relais**, dans un terminal, depuis ce dossier :
   ```
   node relay\server.js
   ```
   Laissez-le ouvert, puis ouvrez <http://127.0.0.1:4317> dans votre navigateur : la page se connecte toute seule.

2. **Brancher Claude Code**. Dans un second terminal :
   ```
   node hook\show-hooks.js
   ```
   Copiez le bloc JSON affiché dans `%USERPROFILE%\.claude\settings.json` (clé `"hooks"` ; si elle existe déjà, ajoutez-y les événements).

3. **Redémarrez Claude Code** (ou ouvrez `/hooks` pour recharger la configuration) et donnez-lui une tâche : un personnage apparaît et se déplace.

## Confidentialité

Les hooks envoient au relais : le nom de l'outil, un résumé de 80 caractères maximum (chemin du fichier, commande, motif de recherche) et les messages de notification. Pour n'envoyer **ni chemins, ni commandes, ni messages**, définissez la variable `AGENT_FACTORY_REDACT=1` (par exemple `setx AGENT_FACTORY_REDACT 1`, puis rouvrez le terminal de Claude Code).

## Limites connues

- Chaque session Claude Code est un personnage. Je n'ai pas vérifié si les hooks permettent de distinguer les sous-agents : leurs actions apparaissent sous la session principale.
- Le résultat des tests (réussi/échoué) est déduit de la sortie de la commande Bash. C'est une heuristique, pas une certitude.
- « Stop » se déclenche à chaque fin de réponse de Claude : le personnage va au sas de sortie, puis revient dès la prochaine action.

## Utiliser la page hébergée ailleurs (GitHub Pages, Netlify…)

1. Déposez `index.html` et les dossiers `css/` et `js/` sur l'hébergeur (la page est faite de modules ES : elle ne fonctionne pas en double-cliquant sur `index.html`, il faut un serveur HTTP, comme le relais ou GitHub Pages).
2. Lancez le relais en autorisant cette adresse :
   ```
   set ALLOW_ORIGIN=https://votre-site.fr
   node relay\server.js
   ```
3. Ouvrez `https://votre-site.fr/?relay=http://127.0.0.1:4317`.

À savoir : les navigateurs récents peuvent demander une autorisation pour qu'un site en https contacte votre machine, ou le bloquer selon la version. Si ça échoue, utilisez simplement <http://127.0.0.1:4317> (étape 1), qui n'a pas ce problème.

## Brancher une autre IA

Tout outil capable d'envoyer du JSON peut alimenter la scène : `POST http://127.0.0.1:4317/event`

```json
{ "agent_id": "a1", "event": "PreToolUse", "tool": "Read", "input": "src/app.ts", "name": "Mon agent" }
```

| Champ | Rôle |
|---|---|
| `agent_id` (obligatoire) | Identifiant stable de l'agent. |
| `event` (obligatoire) | `SessionStart`, `SubagentStart`, `PreToolUse`, `PostToolUse`, `Notification`, `Stop`, `SubagentStop`. |
| `tool` | `Read`, `Grep`, `Glob`, `WebSearch`, `WebFetch` (lecture) · `Edit`, `Write`, `MultiEdit`, `NotebookEdit` (écriture) · `TodoWrite`, `Task` (tâches) · `Bash` (commandes, ou tests si l'entrée contient test, jest, vitest ou pytest). |
| `input`, `message` | Texte affiché dans le journal (200 caractères maximum). |
| `name`, `mission` | Nom et mission affichés dans « Qui est qui ». |
| `parent_id` | Rattache l'agent à un agent principal (sous-agent). |
| `result` | `pass` ou `fail`, sur `PostToolUse` d'une commande de test. |

## Sécurité du relais

Il refuse les requêtes dont l'en-tête `Host` n'est pas `127.0.0.1` ou `localhost` (protection contre le DNS rebinding) et les POST venant d'un site web non autorisé.

## Structure du code

```
index.html            structure de la page (HTML seulement)
css/style.css         mise en page ; couleurs et polices viennent du thème actif (variables CSS)
js/
  main.js             point d'entrée : branche les modules, lance la boucle d'animation
  config.js           constantes (événements connus, réglage « moins d'animations »)
  store.js            l'état partagé de l'application (un seul objet `app`)
  core/               logique pure, sans DOM ni dessin → testée par `npm test`
    events.js           événement de hook → état des agents (fonction `reduce`), textes en français
    world.js            grille, zones, décor, projection isométrique, recherche de chemin
  sim/                moteur de simulation (n'affiche rien)
    simulation.js       file d'événements, positions des ouvriers, particules
    demo.js             génère des sessions d'agents factices
  render/             tout ce qui dessine sur le canevas
    canvas.js           canevas, contexte 2D, palette et temps d'animation courants
    draw-kit.js         primitives partagées (polygones, faces isométriques, murs, fenêtres…)
    scene.js            dessine une image complète (ordre expliqué dans `draw`)
  themes/             un fichier par thème + index.js (registre et description d'un thème)
  ui/                 tout ce qui touche au HTML : panneaux, infobulle, boutons, sélecteur de thème
  io/                 sources d'événements : rejeu manuel (replay.js) et direct (live.js)
relay/server.js       relais local (POST /event → flux SSE) et serveur de la page
hook/                 hook Claude Code et générateur de configuration
test/                 tests de la logique pure
```

Règle de dépendance : `core` ne dépend de rien ; `sim` dépend de `core` ; `render` lit `sim` ; `ui` et `io` pilotent le tout. Les thèmes ne dépendent que de `render/draw-kit.js`, `render/canvas.js`, `core/` et `store.js` (pour lire, par exemple, l'état de la lampe des tests). Aucune dépendance circulaire.

**Ajouter un thème** : copiez `js/themes/space.js` en `js/themes/montheme.js`, modifiez-le, puis ajoutez-le dans `js/themes/index.js`. La description des champs d'un thème est en tête de ce fichier.

**Outils de développement** (facultatifs) : `npm install`, puis `npm test` (tests de la logique) et `npm run lint` (ESLint : variables non définies, imports inutiles). `npm start` lance le relais.
