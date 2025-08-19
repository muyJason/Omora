import { loadRegistry } from '../core/registry.js'
import { initRail } from './rail.js'
import { loadFeature } from './loader.js'

type Feature = { id: string; name: string; icon: string; tooltip?: string; entry: { html: string } }

const STATE_KEY = 'omora:ui:state'

function getState() {
  return chrome.storage.local.get(STATE_KEY).then(r => r[STATE_KEY])
}

function setState(collapsed: boolean) {
  return chrome.storage.local.set({ [STATE_KEY]: { collapsed } })
}

async function init() {
  const rail = document.querySelector('.om-rail') as HTMLDivElement
  const shell = document.querySelector('.om-shell') as HTMLDivElement
  const panel = document.querySelector('.om-panel') as HTMLDivElement
  const title = document.getElementById('om-title') as HTMLSpanElement
  const close = document.getElementById('om-close') as HTMLButtonElement
  const collapse = () => {
    shell.style.display = 'none'
    title.textContent = ''
    const active = rail.querySelector('.om-rail__icon--active') as HTMLButtonElement | null
    if (active) active.classList.remove('om-rail__icon--active')
    setState(true)
  }
  const expand = () => {
    shell.style.display = ''
    setState(false)
  }
  const features = (await loadRegistry()) as Feature[]
  initRail(rail, features)
  rail.addEventListener('omora:select', e => {
    const feature = (e as CustomEvent).detail.feature as Feature
    loadFeature(panel, feature)
    expand()
  })
  close.addEventListener('click', () => collapse())
  document.addEventListener('omora:feature-activated', e => {
    title.textContent = (e as CustomEvent).detail.name ?? ''
  })
  const state = await getState()
  state?.collapsed ? collapse() : expand()
}

init().catch(err => console.error(err))
