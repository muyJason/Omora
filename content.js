(() => {
  if (document.getElementById('omora-sidebar')) return;

  const sidebar = document.createElement('iframe');
  sidebar.id = 'omora-sidebar';
  sidebar.src = chrome.runtime.getURL('sidebar.html');
  Object.assign(sidebar.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '400px',
    height: '100vh',
    border: 'none',
    borderLeft: '1px solid #ccc',
    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
    zIndex: '2147483647',
    background: 'white'
  });

  document.body.style.marginRight = '400px';
  document.body.appendChild(sidebar);
})();
