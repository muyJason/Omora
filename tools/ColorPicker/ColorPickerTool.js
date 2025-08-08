export class ColorPickerTool {
  constructor() {
    this.id = 'color-picker'
    this.icon = '🎨'
    this.tooltip = 'Color Picker'
    this.root = undefined
  }
  execute(container) {
    const styleId = 'color-picker-style'
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link')
      link.id = styleId
      link.rel = 'stylesheet'
      link.href = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL('tools/ColorPicker/colorPicker.css') : 'tools/ColorPicker/colorPicker.css'
      document.head.appendChild(link)
    }
    const root = document.createElement('div')
    root.className = 'color-picker'
    const input = document.createElement('input')
    input.type = 'color'
    input.value = localStorage.getItem('omoraColor') || '#ff0000'
    const preview = document.createElement('div')
    preview.className = 'cp-preview'
    preview.style.background = input.value
    const hex = document.createElement('input')
    hex.type = 'text'
    hex.value = input.value
    const copy = document.createElement('button')
    copy.textContent = 'Copy'
    copy.addEventListener('click', () => navigator.clipboard.writeText(hex.value))
    input.addEventListener('input', () => {
      hex.value = input.value
      localStorage.setItem('omoraColor', input.value)
      preview.style.background = input.value
    })
    hex.addEventListener('input', () => {
      if (/^#([0-9A-Fa-f]{6})$/.test(hex.value)) {
        input.value = hex.value
        localStorage.setItem('omoraColor', hex.value)
        preview.style.background = hex.value
      }
    })
    const row = document.createElement('div')
    row.className = 'row'
    row.appendChild(preview)
    row.appendChild(hex)
    row.appendChild(copy)
    root.appendChild(input)
    root.appendChild(row)
    container.appendChild(root)
    this.root = root
  }
  onClose() {
    if (this.root) {
      this.root.remove()
      this.root = undefined
    }
  }
}
