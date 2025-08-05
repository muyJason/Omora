(function() {
  const existing = document.getElementById('omora-sidebar');
  if (existing) {
    existing.remove();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'omora-sidebar';
  iframe.src = chrome.runtime.getURL('sidebar.html');
  Object.assign(iframe.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '400px',
    height: '100vh',
    border: 'none',
    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
    zIndex: '2147483647'
  });
  document.body.appendChild(iframe);
})();
