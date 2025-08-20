chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
})

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === 'omora:open-esidebar' && sender.tab && sender.tab.id) {
    const tabId = sender.tab.id
    const key = 'omora:feature:' + tabId
    chrome.storage.session.set({ [key]: msg.feature })
    chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true })
    chrome.sidePanel.open({ tabId })
  }
})

chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.session.remove('omora:feature:' + tabId)
})
