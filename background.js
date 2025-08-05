function broadcastState() {
  chrome.storage.local.get(
    ['sidebarVisible', 'sidebarExpanded'],
    ({ sidebarVisible, sidebarExpanded }) => {
      const message = {
        type: 'apply-sidebar-state',
        visible: sidebarVisible !== false,
        expanded: sidebarExpanded === true,
      };
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id !== undefined) {
            chrome.tabs.sendMessage(tab.id, message);
          }
        });
      });
    },
  );
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  const toggle = () => {
    chrome.storage.local.get('sidebarVisible', ({ sidebarVisible }) => {
      chrome.storage.local.set({ sidebarVisible: !(sidebarVisible !== false) });
    });
  };

  chrome.tabs.sendMessage(tab.id, { type: 'ensure-sidebar' }, (response) => {
    if (chrome.runtime.lastError || !response || !response.present) {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }, toggle);
    } else {
      toggle();
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    chrome.storage.local.get('sidebarVisible', ({ sidebarVisible }) => {
      chrome.storage.local.set({ sidebarVisible: !(sidebarVisible !== false) });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'hide-sidebar') {
    chrome.storage.local.set({ sidebarVisible: false });
    sendResponse({ success: true });
  } else if (message.type === 'TOGGLE_SIDEBAR') {
    sendResponse({ success: true });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.sidebarVisible || changes.sidebarExpanded)) {
    broadcastState();
  }
});

chrome.runtime.onStartup.addListener(broadcastState);
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ sidebarVisible: true, sidebarExpanded: false }, broadcastState);
});

