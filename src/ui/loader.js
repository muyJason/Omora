import { createSandboxedIframe } from '../core/sandbox.js'

export function loadFeature(panel, feature) {
  panel.innerHTML = ''
  const url = chrome.runtime.getURL(`src/features/${feature.id}/${feature.entry.html}`)
  const iframe = createSandboxedIframe(url)
  const host = document.createElement('div')
  host.className = 'om-panel__host'
  host.appendChild(iframe)
  panel.appendChild(host)
  const ev = new CustomEvent('omora:feature-activated', { detail: { id: feature.id, name: feature.name } })
  document.dispatchEvent(ev)
}
