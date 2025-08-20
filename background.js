chrome.runtime.onInstalled.addListener(() => {
  if (!chrome.sidePanel) return
  chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'omora:has-sidepanel') {
    sendResponse({ ok: !!chrome.sidePanel })
    return
  }
  if (msg && msg.type === 'omora:open-esidebar' && sender.tab && sender.tab.id && chrome.sidePanel) {
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
