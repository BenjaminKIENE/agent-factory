// Panneaux HTML : « Qui est qui », journal, résumé chiffré et légende des zones.

import { actionLong, eventText } from '../core/events.js';
import { STATIONS, TOKEN } from '../core/world.js';
import { visible } from '../sim/simulation.js';
import { app } from '../store.js';
import { $, el, fmtTime } from './dom.js';
import { updateTip } from './tooltip.js';

function pillFor(a) {
  if (a.status === 'working') return { text: actionLong(a.tool, a.station), color: 'var(' + (TOKEN[a.station] || '--ink-2') + ')' };
  if (a.status === 'waiting') return { text: 'Attend votre accord', color: 'var(--warn)' };
  if (a.status === 'done') return { text: 'Terminé', color: 'var(--ok)' };
  return { text: 'Réfléchit', color: 'var(--ink-2)' };
}
function agentLi(a, isSub) {
  const li = el('li', 'agent' + (isSub ? ' sub' : ''));
  li.style.setProperty('--ag', 'var(--a' + ((a.ci % 5) + 1) + ')');
  li.appendChild(el('span', 'swatch'));
  li.appendChild(el('span', 'name', a.name));
  const p = pillFor(a);
  const pill = el('span', 'pill', p.text);
  pill.style.setProperty('--pc', p.color);
  li.appendChild(pill);
  const par = a.parentId && app.state.agents[a.parentId];
  const role = isSub ? 'Sous-agent' + (par ? ' de ' + par.name : '') : 'Agent principal';
  li.appendChild(el('span', 'role', role + (a.mission ? ' · mission : ' + a.mission : '')));
  if (a.detail && (a.status === 'working' || a.status === 'waiting')) li.appendChild(el('span', 'meta', a.detail));
  return li;
}
export function renderPanels() {
  const vis = app.state.order.map(function (id) { return app.state.agents[id]; }).filter(function (a) { return a && visible(a); });
  const ul = $('agentList');
  ul.textContent = '';
  const mains = vis.filter(function (a) { return !a.parentId; });
  const mainIds = new Set(mains.map(function (a) { return a.id; }));
  if (!vis.length) ul.appendChild(el('li', 'empty', 'Aucun agent actif. Lancez la simulation ou rejouez des événements.'));
  mains.forEach(function (m) {
    ul.appendChild(agentLi(m, false));
    vis.filter(function (a) { return a.parentId === m.id; }).forEach(function (s) { ul.appendChild(agentLi(s, true)); });
  });
  vis.filter(function (a) { return a.parentId && !mainIds.has(a.parentId); }).forEach(function (s) { ul.appendChild(agentLi(s, true)); });

  const ol = $('log');
  ol.textContent = '';
  app.state.log.slice(0, 9).forEach(function (e) {
    const li = el('li');
    li.appendChild(el('span', 't', fmtTime(e.t)));
    const line = el('span', 'line');
    line.appendChild(el('b', null, e.name));
    line.appendChild(document.createTextNode(' ' + eventText(e) + ' '));
    if (e.detail) line.appendChild(el('i', null, '· ' + e.detail));
    li.appendChild(line);
    ol.appendChild(li);
  });

  const active = vis.filter(function (a) { return !a.parentId && a.status !== 'done'; }).length;
  const subs = vis.filter(function (a) { return a.parentId && a.status !== 'done'; }).length;
  const sm = $('summary');
  sm.textContent = '';
  [['agents actifs', active], ['sous-agents', subs], ['tests réussis', app.state.tests.pass], ['tests échoués', app.state.tests.fail]].forEach(function (x) {
    const s = el('span');
    s.appendChild(document.createTextNode(x[0] + ' '));
    s.appendChild(el('b', null, String(x[1])));
    sm.appendChild(s);
  });
  $('btnAdd').disabled = app.mode === 'sim' && app.autoIds.size >= 5;
  if (app.hover) updateTip();
}

export function buildLegend() {
  const ul = $('legend');
  ul.textContent = '';
  STATIONS.forEach(function (s) {
    const li = el('li');
    li.style.setProperty('--c', 'var(' + TOKEN[s.id] + ')');
    li.appendChild(el('span', 'sw'));
    li.appendChild(el('strong', null, s.name));
    li.appendChild(el('span', 'ds', s.desc));
    li.appendChild(el('span', 'tl', 'Outils Claude Code correspondants : ' + s.tools));
    ul.appendChild(li);
  });
}
