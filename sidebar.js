function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('sidebarTheme', ({ sidebarTheme }) => {
    applyTheme(sidebarTheme || 'light');
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.sidebarTheme) {
      applyTheme(changes.sidebarTheme.newValue || 'light');
    }
  });

  const hideButton = document.getElementById('hide-sidebar-btn');
  if (hideButton) {
    hideButton.addEventListener('click', () => {
      parent.postMessage({ type: 'hide-sidebar' }, '*');
    });
  }

  const settingsButton = document.getElementById('settings-btn');
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });
  }
});
