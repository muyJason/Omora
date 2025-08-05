function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
}

function applyExpanded(expanded) {
  const body = document.body;
  body.classList.toggle('expanded', expanded);
  body.classList.toggle('collapsed', !expanded);
  const toggle = document.getElementById('toggle-expand-btn');
  if (toggle) {
    toggle.textContent = expanded ? '«' : '»';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['sidebarTheme', 'sidebarExpanded'],
    ({ sidebarTheme, sidebarExpanded }) => {
      applyTheme(sidebarTheme || 'light');
      applyExpanded(sidebarExpanded === true);
    },
  );

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.sidebarTheme) {
        applyTheme(changes.sidebarTheme.newValue || 'light');
      }
      if (changes.sidebarExpanded) {
        applyExpanded(changes.sidebarExpanded.newValue === true);
      }
    }
  });

  const hideButton = document.getElementById('hide-sidebar-btn');
  if (hideButton) {
    hideButton.addEventListener('click', () => {
      chrome.storage.local.set({ sidebarVisible: false }, () => {
        chrome.runtime.sendMessage({ type: 'hide-sidebar' });
        parent.postMessage({ type: 'hide-sidebar' }, '*');
      });
    });
  }

  const toggleButton = document.getElementById('toggle-expand-btn');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      chrome.storage.local.get('sidebarExpanded', ({ sidebarExpanded }) => {
        const newValue = !(sidebarExpanded === true);
        chrome.storage.local.set({ sidebarExpanded: newValue });
        applyExpanded(newValue);
      });
    });
  }

  const settingsButton = document.getElementById('settings-btn');
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });
  }
});

