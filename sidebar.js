(() => {
  try {
    const body = document.body;
    if (!body) {
      return;
    }

    let sidebar;
    let observer;

    const adjustBody = () => {
      if (sidebar) {
        body.style.marginRight = `${sidebar.offsetWidth}px`;
      } else {
        body.style.marginRight = '';
      }
    };

    const showSidebar = () => {
      if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'omora-sidebar';
        Object.assign(sidebar.style, {
          position: 'fixed',
          top: '0',
          right: '0',
          width: '300px',
          height: '100vh',
          backgroundColor: '#fff',
          borderLeft: '1px solid #ccc',
          zIndex: '2147483647',
          overflow: 'auto',
          resize: 'horizontal',
          minWidth: '150px',
          maxWidth: '80vw'
        });
        body.appendChild(sidebar);
        observer = new ResizeObserver(adjustBody);
        observer.observe(sidebar);
      }
      adjustBody();
    };

    const hideSidebar = () => {
      if (sidebar) {
        observer.disconnect();
        sidebar.remove();
        sidebar = undefined;
      }
      adjustBody();
    };

    chrome.storage.local.get('sidebarVisible', ({ sidebarVisible }) => {
      if (sidebarVisible) {
        showSidebar();
      }
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.sidebarVisible === true) {
        showSidebar();
      } else if (message.sidebarVisible === false) {
        hideSidebar();
      }
    });
  } catch (e) {
    /* Fail silently on restricted pages */
  }
})();
