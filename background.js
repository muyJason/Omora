chrome.action.onClicked.addListener((tab) => {
  if (tab.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle-sidebar' });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id !== undefined) {
        chrome.tabs.sendMessage(activeTab.id, { type: 'toggle-sidebar' }, () => {
          if (chrome.runtime.lastError) {
            // No matching content script; ignore.
          }
        });
      }
    });
  }
});
