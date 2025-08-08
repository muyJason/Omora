(() => {
  const getURL = path => typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(path) : path
  Promise.all([
    import(getURL('core/SidebarManager.js')),
    import(getURL('tools/index.js'))
  ]).then(([core, tools]) => {
    const manager = new core.SidebarManager()
    tools.registerAllTools(manager)
  }).catch(() => {})
})()
