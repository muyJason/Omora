chrome.action.onClicked.addListener(async () => {
  const { sidebarVisible = false } = await chrome.storage.local.get('sidebarVisible');
  const newState = !sidebarVisible;
  await chrome.storage.local.set({ sidebarVisible: newState });
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { sidebarVisible: newState });
    }
  }
});
