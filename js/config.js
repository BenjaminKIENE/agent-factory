// Constantes partagées.

/** L'utilisateur demande moins d'animations (réglage système). */
export const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Types d'événements acceptés (même vocabulaire que les hooks de Claude Code). */
export const KNOWN = ['SessionStart', 'SubagentStart', 'PreToolUse', 'PostToolUse', 'Notification', 'Stop', 'SubagentStop'];

/** Clé de stockage local du thème choisi. */
export const THEME_KEY = 'usine-theme';
