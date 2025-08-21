const VALID_FEATURES = new Set(['colorpicker','notes'])

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
  if (chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
  }
})

chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'sidepanel.html' })
})

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== 'omora:open-esidebar' || !sender.tab?.id) return
  if (!VALID_FEATURES.has(msg.feature)) return
  const tabId = sender.tab.id
  const key = 'omora:feature:' + tabId
  chrome.storage.session.set({ [key]: msg.feature }, () => {
    chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true }, () => {
      chrome.sidePanel.open({ tabId })
    })
  })
})

chrome.action.onClicked.addListener(tab => {
  if (!tab?.id) return
  const tabId = tab.id
  chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true }, () => {
    chrome.sidePanel.open({ tabId })
  })
})

chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.session.remove('omora:feature:' + tabId)
})
