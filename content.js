(function () {
  const SIDEBAR_ID = 'omora-sidebar';

  const existing = document.getElementById(SIDEBAR_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = SIDEBAR_ID;
  iframe.src = chrome.runtime.getURL('sidebar.html');
  Object.assign(iframe.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '400px',
    height: '100vh',
    border: 'none',
    zIndex: '2147483647',
    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
    background: 'white'
  });
  document.body.appendChild(iframe);

  if (!window.__omoraSidebarListenerAdded) {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'hide-sidebar') {
        const sidebar = document.getElementById(SIDEBAR_ID);
        if (sidebar) {
          sidebar.remove();
        }
      }
    });
    window.__omoraSidebarListenerAdded = true;
  }
})();

