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

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get('sidebarVisible', ({ sidebarVisible }) => {
    chrome.storage.local.set({ sidebarVisible: !(sidebarVisible !== false) });
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    chrome.storage.local.get('sidebarVisible', ({ sidebarVisible }) => {
      chrome.storage.local.set({ sidebarVisible: !(sidebarVisible !== false) });
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'hide-sidebar') {
    chrome.storage.local.set({ sidebarVisible: false });
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

