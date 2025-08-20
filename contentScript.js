if (!chrome.sidePanel) {
  return
}
const key = 'omora:offset:' + location.origin
const host = document.createElement('div')
const root = host.attachShadow({ mode: 'open' })
const style = document.createElement('style')
style.textContent = '#rail{position:fixed!important;right:0;width:48px;background:#111;display:flex;flex-direction:column;z-index:2147483647}button{width:48px;height:48px;background:none;border:0;color:#fff;cursor:pointer}'
const rail = document.createElement('div')
rail.id = 'rail'
;[{ id: 'notes', label: 'N' }, { id: 'colorpicker', label: 'C' }].forEach(({ id, label }) => {
  const btn = document.createElement('button')
  btn.textContent = label
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'omora:open-esidebar', feature: id })
  })
  rail.appendChild(btn)
})
root.appendChild(style)
root.appendChild(rail)
document.documentElement.appendChild(host)
chrome.storage.local.get(key).then(r => {
  const top = r[key]
  const h = window.innerHeight || document.documentElement.clientHeight
  rail.style.top = (typeof top === 'number' ? top : h * 0.3) + 'px'
})
let startY
let startTop
rail.addEventListener('pointerdown', e => {
  if (e.target !== rail) return
  startY = e.clientY
  startTop = parseInt(rail.style.top, 10)
  const move = ev => {
    const t = startTop + ev.clientY - startY
    rail.style.top = (t < 0 ? 0 : t) + 'px'
  }
  const up = () => {
    document.removeEventListener('pointermove', move)
    document.removeEventListener('pointerup', up)
    const val = parseInt(rail.style.top, 10)
    chrome.storage.local.set({ [key]: val })
  }
  document.addEventListener('pointermove', move)
  document.addEventListener('pointerup', up)
})
