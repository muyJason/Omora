(() => {
  const getURL = path => typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(path) : path
  Promise.all([
    import(getURL('core/SidebarManager.js')),
    import(getURL('tools/index.js'))
  ]).then(async ([core, tools]) => {
    window.omoraForceTheme = 'dark'
    const sidebarManager = new core.SidebarManager()
    tools.registerAllTools(sidebarManager)
    sidebarManager.container.style.display = 'none'
    chrome.runtime.onMessage.addListener(message => {
      if (typeof message.sidebarVisible !== 'undefined') {
        sidebarManager.container.style.display = message.sidebarVisible ? 'flex' : 'none'
        if (!message.sidebarVisible) sidebarManager.closeActiveTool()
      }
    })
    const { sidebarVisible = false } = await chrome.storage.local.get('sidebarVisible')
    if (sidebarVisible) sidebarManager.container.style.display = 'flex'
  }).catch(() => {})
})()
