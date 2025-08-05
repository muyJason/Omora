(function () {
  const SIDEBAR_ID = 'omora-sidebar-container';

  let sidebarVisible = false;
  let sidebarExpanded = false;
  let container = null;

  async function injectSidebar() {
    if (container || !document.body) return;

    container = document.createElement('div');
    container.id = SIDEBAR_ID;
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      height: '100vh',
      width: sidebarExpanded ? '250px' : '60px',
      zIndex: '2147483647',
      boxShadow: '0 0 8px rgba(0,0,0,0.15)',
      background: 'white',
    });

    const shadow = container.attachShadow({ mode: 'open' });
    try {
      const res = await fetch(chrome.runtime.getURL('sidebar.html'));
      const html = await res.text();
      const template = document.createElement('template');
      template.innerHTML = html;
      const link = template.content.querySelector('link[href="sidebar.css"]');
      if (link) link.href = chrome.runtime.getURL('sidebar.css');
      const scriptPlaceholder = template.content.querySelector('script[src="sidebar.js"]');
      if (scriptPlaceholder) scriptPlaceholder.remove();
      shadow.appendChild(template.content);
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('sidebar.js');
      shadow.appendChild(script);
    } catch (e) {
      console.error('Failed to inject sidebar:', e);
    }

    document.body.appendChild(container);
  }

  function removeSidebar() {
    if (container) {
      container.remove();
      container = null;
    }
  }

  function applyState() {
    if (sidebarVisible) {
      injectSidebar().then(() => {
        if (container) {
          container.style.width = sidebarExpanded ? '250px' : '60px';
        }
      });
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

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'apply-sidebar-state') {
      if (typeof message.visible === 'boolean') {
        sidebarVisible = message.visible;
      }
      if (typeof message.expanded === 'boolean') {
        sidebarExpanded = message.expanded;
      }
      applyState();
    } else if (message.type === 'ensure-sidebar') {
      sendResponse({ present: !!document.getElementById(SIDEBAR_ID) });
    }
  });

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'hide-sidebar') {
      sidebarVisible = false;
      removeSidebar();
    }
  });
})();
