(() => {
  const getURL = path => typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(path) : path
  Promise.all([
    import(getURL('core/SidebarManager.js')),
    import(getURL('tools/index.js'))
  ]).then(async ([core, tools]) => {
    window.omoraForceTheme = 'dark'
    const manager = new core.SidebarManager()
    tools.registerAllTools(manager)
    manager.container.style.display = 'none'
    chrome.runtime.onMessage.addListener(message => {
      if (typeof message.sidebarVisible !== 'undefined') {
        manager.container.style.display = message.sidebarVisible ? 'flex' : 'none'
        if (!message.sidebarVisible) manager.closeActiveTool()
      }
    })
    const { sidebarVisible = false } = await chrome.storage.local.get('sidebarVisible')
    if (sidebarVisible) manager.container.style.display = 'flex'
  }).catch(() => {})
})()
