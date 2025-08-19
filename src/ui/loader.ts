import { createSandboxedIframe } from '../core/sandbox.js'
import type { Feature } from './app.js'

export function loadFeature(panel: HTMLDivElement, feature: Feature) {
  panel.innerHTML = ''
  const url = chrome.runtime.getURL(`src/features/${feature.id}/${feature.entry.html}`)
  const iframe = createSandboxedIframe(url)
  panel.appendChild(iframe)
  const ev = new CustomEvent('omora:feature-activated', { detail: { id: feature.id, name: feature.name } })
  document.dispatchEvent(ev)
}
