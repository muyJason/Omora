(function () {
  const SIDEBAR_ID = 'omora-sidebar';

  let sidebarVisible = false;
  let sidebarExpanded = false;

  function createSidebar() {
    let iframe = document.getElementById(SIDEBAR_ID);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = SIDEBAR_ID;
      iframe.src = chrome.runtime.getURL('sidebar.html');
      Object.assign(iframe.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        height: '100vh',
        border: 'none',
        zIndex: '2147483647',
        boxShadow: '0 0 8px rgba(0,0,0,0.15)',
        background: 'white',
      });
      document.body.appendChild(iframe);
    }
    iframe.style.width = sidebarExpanded ? '250px' : '60px';
  }

  function removeSidebar() {
    const iframe = document.getElementById(SIDEBAR_ID);
    if (iframe) {
      iframe.remove();
    }
  }

  function applyState() {
    if (sidebarVisible) {
      createSidebar();
    } else {
      removeSidebar();
    }
  }

  chrome.storage.local.get(
    ['sidebarVisible', 'sidebarExpanded'],
    ({ sidebarVisible: visible, sidebarExpanded: expanded }) => {
      sidebarVisible = visible !== false;
      sidebarExpanded = expanded === true;
      applyState();
    },
  );

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'apply-sidebar-state') {
      if (typeof message.visible === 'boolean') {
        sidebarVisible = message.visible;
      }
      if (typeof message.expanded === 'boolean') {
        sidebarExpanded = message.expanded;
      }
      applyState();
    }
  });

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'hide-sidebar') {
      sidebarVisible = false;
      removeSidebar();
    }
  });
})();

