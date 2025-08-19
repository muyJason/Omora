import { loadRegistry } from '../core/registry.js';
import { initRail } from './rail.js';
import { initPanel } from './panel.js';
import { loadFeature } from './loader.js';

async function init() {
  const features = await loadRegistry();
  const rail = initRail(features);
  const panel = initPanel();
  document.body.appendChild(rail);
  document.body.appendChild(panel);
  rail.addEventListener('omora:select', (event) => {
    const feature = event.detail.feature;
    loadFeature(panel, feature);
  });
}

init().catch((err) => console.error(err));
