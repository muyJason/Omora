import { createSandboxedIframe } from '../core/sandbox.js';

export function loadFeature(container, feature) {
  container.innerHTML = '';
  const url = chrome.runtime.getURL(`src/features/${feature.id}/${feature.entry.html}`);
  const iframe = createSandboxedIframe(url);
  container.appendChild(iframe);
}
