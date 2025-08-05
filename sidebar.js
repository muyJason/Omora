document.addEventListener('DOMContentLoaded', () => {
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
