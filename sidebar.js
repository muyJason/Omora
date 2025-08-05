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

function showView(view) {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  currentView = view;
  chrome.storage.local.set({ sidebarView: view });

  contentArea.innerHTML = '';
  if (view === 'settings') {
    const iframe = document.createElement('iframe');
    iframe.src = 'settings.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    contentArea.appendChild(iframe);
  } else {
    const homeDiv = document.createElement('div');
    homeDiv.innerHTML = '<p>Omora Sidebar Ready</p>';
    contentArea.appendChild(homeDiv);
  }
}

let currentView = 'home';

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['sidebarTheme', 'sidebarExpanded', 'sidebarView'],
    ({ sidebarTheme, sidebarExpanded, sidebarView }) => {
      applyTheme(sidebarTheme || 'light');
      applyExpanded(sidebarExpanded === true);
      showView(sidebarView === 'settings' ? 'settings' : 'home');
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
      if (changes.sidebarView) {
        showView(changes.sidebarView.newValue === 'settings' ? 'settings' : 'home');
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
      showView(currentView === 'settings' ? 'home' : 'settings');
    });
  }
});

