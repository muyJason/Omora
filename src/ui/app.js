import { loadRegistry } from '../core/registry.js'
import { initRail } from './rail.js'
import { loadFeature } from './loader.js'
import { buildHeader, setTitle } from './header.js'

const STATE_KEY = 'omora:ui:state'

function getState() {
  return chrome.storage.local.get(STATE_KEY).then(r => r[STATE_KEY])
}

function setState(collapsed) {
  return chrome.storage.local.set({ [STATE_KEY]: { collapsed } })
}

async function init() {
  const rail = document.querySelector('.om-rail')
  const shell = document.querySelector('.om-shell')
  const panel = document.querySelector('.om-panel')
  const header = buildHeader()
  shell.insertBefore(header, panel)
  const close = header.querySelector('#om-close')
  const collapse = () => {
    document.body.classList.add('om-collapsed')
    setState(true)
  }
  const expand = () => {
    document.body.classList.remove('om-collapsed')
    setState(false)
  }
  const toggle = () => {
    document.body.classList.contains('om-collapsed') ? expand() : collapse()
  }
  const features = await loadRegistry()
  initRail(rail, features)
  rail.addEventListener('omora:select', e => {
    const feature = e.detail.feature
    loadFeature(panel, feature)
    expand()
  })
  close.addEventListener('click', () => collapse())
  document.addEventListener('omora:feature-activated', e => {
    setTitle(e.detail.name ?? '')
  })
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyO') {
      e.preventDefault()
      toggle()
    } else if (e.ctrlKey && e.altKey && e.code.startsWith('Digit')) {
      const index = parseInt(e.code.slice(5), 10) - 1
      if (index >= 0) {
        const buttons = Array.from(rail.querySelectorAll('.om-rail__icon'))
        const btn = buttons[index]
        if (btn) {
          e.preventDefault()
          btn.focus()
          btn.click()
        }
      }
    }
  })
  const state = await getState()
  state?.collapsed ? collapse() : expand()
}

init().catch(err => console.error(err))
