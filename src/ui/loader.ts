import { FeatureMeta } from '../core/types';
import { createSandboxedIframe } from '../core/sandbox';
export function loadFeature(container: HTMLElement, feature: FeatureMeta): void {
  container.innerHTML = '';
  const url = chrome.runtime.getURL(`src/features/${feature.id}/${feature.entry.html}`);
  const iframe = createSandboxedIframe(url);
  container.appendChild(iframe);
}
