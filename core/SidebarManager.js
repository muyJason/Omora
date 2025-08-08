export class SidebarManager {
  constructor() {
    this.tools = new Map()
    this.activeId = undefined
    const saved = parseInt(localStorage.getItem('omoraPanelWidth') || '300', 10)
    this.panelWidth = isNaN(saved) ? 300 : saved
    this.container = document.createElement('div')
    this.container.id = 'omora-sidebar'
    this.panel = document.createElement('div')
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
  registerTool(tool) {
    const btn = document.createElement('button')
    btn.className = 'omora-btn'
    btn.innerHTML = tool.icon
    btn.title = tool.tooltip
    btn.addEventListener('click', () => this.toggle(tool.id))
    this.iconsTop.appendChild(btn)
    this.tools.set(tool.id, { tool, button: btn })
  }
  toggle(id) {
    if (this.activeId === id) {
      this.closeActiveTool()
      return
    }
    if (this.activeId) this.closeActiveTool()
    const entry = this.tools.get(id)
    if (!entry) return
    this.activeId = id
    entry.button.classList.add('active')
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
  initResize() {
    let startX = 0
    let startWidth = 0
    const onMouseMove = e => {
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
  applyTheme() {
    let theme = window.omoraForceTheme
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', e => {
        this.container.classList.toggle('omora-theme-dark', e.matches)
        this.container.classList.toggle('omora-theme-light', !e.matches)
      })
    }
    this.container.classList.add('omora-theme-' + theme)
  }
}
