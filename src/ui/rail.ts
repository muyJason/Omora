import { FeatureMeta } from '../core/types';
export function initRail(features: FeatureMeta[]): HTMLElement {
  const rail = document.createElement('div');
  rail.className = 'om-rail';
  features.forEach((feature) => {
    const button = document.createElement('button');
    button.className = 'om-rail__icon';
    button.setAttribute('aria-label', feature.tooltip ?? feature.name);
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(`src/features/${feature.id}/${feature.icon}`);
    img.alt = feature.name;
    button.appendChild(img);
    button.addEventListener('click', () => {
      const ev = new CustomEvent('omora:select', { detail: { feature } });
      rail.dispatchEvent(ev);
    });
    rail.appendChild(button);
  });
  return rail;
}
