(() => {
  try {
    const body = document.body;
    if (!body) {
      return;
    }

    let sidebar;
    let observer;
    let handle;
    let isResizing = false;
    let startResize;
    let onMouseMove;
    let stopResize;

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
          minWidth: '50px',
          maxWidth: '80vw'
        });
        handle = document.createElement('div');
        Object.assign(handle.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '5px',
          height: '100%',
          cursor: 'ew-resize'
        });
        sidebar.appendChild(handle);

        onMouseMove = (e) => {
          if (!isResizing) {
            return;
          }
          const newWidth = Math.max(window.innerWidth - e.clientX, 50);
          sidebar.style.width = `${newWidth}px`;
        };

        stopResize = () => {
          if (!isResizing) {
            return;
          }
          isResizing = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', stopResize);
          body.style.userSelect = '';
        };

        startResize = (e) => {
          isResizing = true;
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', stopResize);
          body.style.userSelect = 'none';
          e.preventDefault();
        };

        handle.addEventListener('mousedown', startResize);

        body.appendChild(sidebar);
        observer = new ResizeObserver(adjustBody);
        observer.observe(sidebar);
      }
      adjustBody();
    };

    const hideSidebar = () => {
      if (sidebar) {
        if (isResizing) {
          stopResize();
        }
        observer.disconnect();
        handle.removeEventListener('mousedown', startResize);
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
