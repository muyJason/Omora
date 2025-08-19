import type { Feature } from './app.js'

export function initRail(container: HTMLDivElement, features: Feature[]) {
  features.forEach(feature => {
    const button = document.createElement('button')
    button.className = 'om-rail__icon'
    button.setAttribute('aria-label', feature.tooltip ?? feature.name)
    const img = document.createElement('img')
    img.src = chrome.runtime.getURL(`src/features/${feature.id}/${feature.icon}`)
    img.alt = feature.name
    button.appendChild(img)
    button.addEventListener('click', () => {
      container.querySelectorAll('.om-rail__icon').forEach(b => b.classList.remove('om-rail__icon--active'))
      button.classList.add('om-rail__icon--active')
      const ev = new CustomEvent('omora:select', { detail: { feature } })
      container.dispatchEvent(ev)
    })
    container.appendChild(button)
  })
}
