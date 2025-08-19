export function initRail(container, features) {
  container.setAttribute('role', 'toolbar')
  features.forEach(feature => {
    const button = document.createElement('button')
    button.className = 'om-rail__icon'
    button.dataset.id = feature.id
    const label = feature.tooltip ?? feature.name
    button.setAttribute('aria-label', label)
    button.title = label
    const img = document.createElement('img')
    img.src = chrome.runtime.getURL(`src/features/${feature.id}/${feature.icon}`)
    img.alt = feature.name
    button.appendChild(img)
    button.addEventListener('click', () => {
      container.querySelectorAll('.om-rail__icon').forEach(b => b.classList.remove('is-active'))
      button.classList.add('is-active')
      const ev = new CustomEvent('omora:select', { detail: { feature } })
      container.dispatchEvent(ev)
    })
    container.appendChild(button)
  })
}
