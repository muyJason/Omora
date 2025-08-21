(() => {
  if (!chrome?.runtime?.id) return
  if (document.getElementById('omora-isidebar-root')) return

  const host = document.createElement('div')
  host.id = 'omora-isidebar-root'
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent =
    '#rail{position:fixed!important;right:0;top:30vh;width:48px;padding:6px;display:flex;flex-direction:column;gap:8px;background:#0f172a;border-radius:10px 0 0 10px;box-shadow:0 8px 24px rgba(0,0,0,.35);z-index:2147483647}' +
    '#rail *{box-sizing:border-box}' +
    '#rail button{width:36px;height:36px;border:0;border-radius:8px;background:#1f2937;color:#e5e7eb;font-weight:600;cursor:pointer}' +
    '#rail button:hover{filter:brightness(1.1)}'

  const rail = document.createElement('div')
  rail.id = 'rail'

  ;[
    { id: 'notes', tooltip: 'Notes', label: 'N' },
    { id: 'colorpicker', tooltip: 'Color Picker', label: 'C' }
  ].forEach(f => {
    const b = document.createElement('button')
    b.dataset.id = f.id
    b.title = f.tooltip
    b.textContent = f.label
    b.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'omora:open-esidebar', feature: f.id })
    })
    rail.appendChild(b)
  })

  shadow.append(style, rail)
  document.documentElement.appendChild(host)

  const key = 'omora:offset:' + location.origin
  chrome.storage.local.get(key).then(r => {
    const v = r[key]
    if (typeof v === 'number') rail.style.top = v + 'px'
  })

  rail.addEventListener('pointerdown', e => {
    if (e.button !== 0) return
    const startY = e.clientY
    const startTop = parseInt(rail.style.top || '0', 10) || rail.getBoundingClientRect().top
    const move = ev => {
      const t = Math.max(0, startTop + ev.clientY - startY)
      rail.style.top = t + 'px'
    }
    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      const t = parseInt(rail.style.top, 10) || 0
      chrome.storage.local.set({ [key]: t })
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  })
})()
