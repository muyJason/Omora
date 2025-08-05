chrome.action.onClicked.addListener((tab) => {
  if (tab.id !== undefined) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js'],
        });
      }
    });
  }
});
