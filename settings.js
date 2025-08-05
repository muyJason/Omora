function initSettings() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  chrome.storage.local.get('sidebarTheme', ({ sidebarTheme }) => {
    toggle.checked = sidebarTheme === 'dark';
  });

  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    chrome.storage.local.set({ sidebarTheme: theme });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettings);
} else {
  initSettings();
}

