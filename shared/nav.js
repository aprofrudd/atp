// shared/nav.js — Pathway navigation bar injected into every module

import { FONT_STACK, THEME } from './theme.js';

// All paths are relative — from any /modules/xxx/ page,
// ../yyy/ reaches a sibling module and ../../ goes home.
const MODULES = [
  { id: 'metabolic-profile', name: 'Metabolic Profile', path: '../metabolic-profile/', connector: 'Overview' },
  { id: 'sarcomere',     name: 'Sarcomere',      path: '../sarcomere/',        connector: 'ATP' },
  { id: 'transport',     name: 'ATP Transport',  path: '../transport/',         connector: 'ATP' },
  { id: 'atp-synthase',  name: 'ATP Synthase',   path: '../atp-synthase/',     connector: 'H\u207A gradient' },
  { id: 'etc',           name: 'ETC',            path: '../etc/',              connector: 'NADH, FADH\u2082' },
  { id: 'krebs',         name: 'Krebs Cycle',    path: '../krebs/',            connector: 'Acetyl-CoA' },
  { id: 'glycolysis',    name: 'Glycolysis',     path: '../glycolysis/',       connector: null },
  { id: 'beta-oxidation', name: '\u03B2-Oxidation', path: '../beta-oxidation/', connector: null },
  { id: 'metabolism-101', name: 'Metabolism 101', path: '../metabolism-101/',  connector: null },
  { id: 'lactate-shuttle', name: 'Lactate Shuttle', path: '../lactate-shuttle/', connector: null },
];

export function initNav(currentModuleId) {
  const slot = document.getElementById('nav-slot');
  if (!slot) return;

  const nav = document.createElement('nav');
  nav.id = 'pathway-nav';
  nav.style.cssText = `
    background: ${THEME.panelBg};
    border-bottom: 2px solid ${THEME.borderClr};
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
    font-family: ${FONT_STACK};
    overflow-x: auto;
  `;

  // Home button — go up two levels from /modules/xxx/
  const home = document.createElement('a');
  home.href = '../../';
  home.textContent = '\u2302 Home';
  home.style.cssText = `
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    color: ${THEME.accent};
    border: 1px solid ${THEME.accent};
    margin-right: 8px;
    transition: background 0.2s, color 0.2s;
  `;
  home.addEventListener('mouseenter', () => { home.style.background = THEME.accent; home.style.color = '#1a1a2e'; });
  home.addEventListener('mouseleave', () => { home.style.background = 'transparent'; home.style.color = THEME.accent; });
  nav.appendChild(home);

  MODULES.forEach((mod, i) => {
    const isCurrent = mod.id === currentModuleId;
    const isAvailable = mod.path !== null;

    // Module box
    const box = document.createElement(isAvailable && !isCurrent ? 'a' : 'span');
    if (isAvailable && !isCurrent) {
      box.href = mod.path;
    }
    box.textContent = mod.name;
    box.style.cssText = `
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: ${isCurrent ? '700' : '500'};
      white-space: nowrap;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
      cursor: ${isAvailable ? 'pointer' : 'default'};
      background: ${isCurrent ? THEME.borderClr : 'transparent'};
      color: ${isCurrent ? THEME.accent : isAvailable ? THEME.label : '#506070'};
      border: 1px solid ${isCurrent ? THEME.accent : isAvailable ? THEME.borderClr : '#2a3545'};
      ${!isAvailable ? 'border-style: dashed; opacity: 0.55;' : ''}
    `;
    if (isAvailable && !isCurrent) {
      box.addEventListener('mouseenter', () => { box.style.background = THEME.btnBg; box.style.color = THEME.text; });
      box.addEventListener('mouseleave', () => { box.style.background = 'transparent'; box.style.color = THEME.label; });
    }
    nav.appendChild(box);

    // Connector arrow + label between modules
    if (i < MODULES.length - 1 && mod.connector) {
      const arrow = document.createElement('span');
      arrow.style.cssText = `
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin: 0 2px;
        flex-shrink: 0;
      `;
      const arrowIcon = document.createElement('span');
      arrowIcon.textContent = '\u2190';
      arrowIcon.style.cssText = `font-size: 0.9rem; color: #506070; line-height: 1;`;
      const label = document.createElement('span');
      label.textContent = mod.connector;
      label.style.cssText = `font-size: 0.6rem; color: #405060; line-height: 1; margin-top: 1px; white-space: nowrap;`;
      arrow.appendChild(arrowIcon);
      arrow.appendChild(label);
      nav.appendChild(arrow);
    } else if (i < MODULES.length - 1) {
      const arrow = document.createElement('span');
      arrow.textContent = '\u2190';
      arrow.style.cssText = `margin: 0 2px; font-size: 0.9rem; color: #506070; flex-shrink: 0;`;
      nav.appendChild(arrow);
    }
  });

  slot.appendChild(nav);
}
