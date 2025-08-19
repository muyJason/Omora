import { loadRegistry } from '../core/registry';
import { initRail } from './rail';
import { initPanel } from './panel';
import { loadFeature } from './loader';
import { FeatureMeta } from '../core/types';
async function init(): Promise<void> {
  const features = await loadRegistry();
  const rail = initRail(features);
  const panel = initPanel();
  document.body.appendChild(rail);
  document.body.appendChild(panel);
  rail.addEventListener('omora:select', (event: Event) => {
    const custom = event as CustomEvent<{ feature: FeatureMeta }>;
    const feature = custom.detail.feature;
    loadFeature(panel, feature);
  });
}

init().catch((err) => console.error(err));
