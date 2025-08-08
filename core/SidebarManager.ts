import { OmoraTool } from './OmoraTool'

interface ToolEntry {
  tool: OmoraTool
  button: HTMLButtonElement
}

export class SidebarManager {
  private tools: Map<string, ToolEntry> = new Map()
  container: HTMLElement
  private panel: HTMLElement
  private iconsTop: HTMLElement
  private resizeHandle: HTMLElement
  private activeId?: string
  private panelWidth: number

  constructor() {
    const saved = parseInt(localStorage.getItem('omoraPanelWidth') || '300', 10)
    this.panelWidth = isNaN(saved) ? 300 : saved
    this.container = document.createElement('div')
    this.container.id = 'omora-sidebar'
    this.panel = document.createElement('div')
    this.panel.id = 'sidebar-panel-container'
    this.panel.className = 'omora-panel'
    this.panel.style.width = '0px'
    this.resizeHandle = document.createElement('div')
    this.resizeHandle.className = 'resize-handle'
    this.panel.appendChild(this.resizeHandle)
    const icons = document.createElement('div')
    icons.className = 'omora-icons'
    this.iconsTop = document.createElement('div')
    this.iconsTop.className = 'icons-top'
    icons.appendChild(this.iconsTop)
    this.container.appendChild(this.panel)
    this.container.appendChild(icons)
    document.body.appendChild(this.container)
    this.applyTheme()
    this.initResize()
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeActiveTool()
    })
  }

  registerTool(tool: OmoraTool) {
    const icon = document.createElement('button')
    icon.className = 'omora-btn'
    icon.innerHTML = tool.icon
    icon.title = tool.tooltip
    icon.addEventListener('click', () => this.toggleTool(tool.id))
    this.iconsTop.appendChild(icon)
    this.tools.set(tool.id, { tool, button: icon })
  }

  private toggleTool(id: string) {
    if (this.activeId === id) {
      this.closeActiveTool()
      return
    }
    const entry = this.tools.get(id)
    if (!entry) return
    if (this.activeId) this.closeActiveTool()
    this.activeId = id
    entry.button.classList.add('active')
    let container = document.querySelector('#sidebar-panel-container') as HTMLElement | null
    if (!container) {
      container = document.createElement('div')
      container.id = 'sidebar-panel-container'
      container.className = 'omora-panel'
      container.style.width = '0px'
      container.appendChild(this.resizeHandle)
      this.container.insertBefore(container, this.container.firstChild)
    }
    this.panel = container
    this.panel.innerHTML = ''
    this.panel.appendChild(this.resizeHandle)
    entry.tool.execute(this.panel)
    if (entry.tool.onOpen) entry.tool.onOpen()
    this.panel.style.width = this.panelWidth + 'px'
  }

  closeActiveTool() {
    if (!this.activeId) return
    const entry = this.tools.get(this.activeId)
    if (entry) {
      entry.button.classList.remove('active')
      if (entry.tool.onClose) entry.tool.onClose()
    }
    this.activeId = undefined
    this.panel.style.width = '0px'
    this.panel.innerHTML = ''
    this.panel.appendChild(this.resizeHandle)
  }

  private initResize() {
    let startX = 0
    let startWidth = 0
    const onMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX
      this.panelWidth = Math.max(200, startWidth + delta)
      this.panel.style.width = this.panelWidth + 'px'
    }
    const stop = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', stop)
      localStorage.setItem('omoraPanelWidth', String(this.panelWidth))
    }
    this.resizeHandle.addEventListener('mousedown', e => {
      startX = e.clientX
      startWidth = this.panelWidth
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', stop)
      e.preventDefault()
    })
  }

  private applyTheme() {
    let theme = (window as any).omoraForceTheme
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', e => {
        this.container.classList.toggle('omora-theme-dark', e.matches)
        this.container.classList.toggle('omora-theme-light', !e.matches)
      })
    }
    this.container.classList.add(`omora-theme-${theme}`)
  }
}
