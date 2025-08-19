chrome.runtime.onInstalled.addListener(() => {
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
});

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});
