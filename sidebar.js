(() => {
  try {
    const body = document.body;
    if (!body) {
      return;
    }

    let sidebar;
    let observer;
    let handle;
    let buttonsContainer;
    let isResizing = false;
    let startResize;
    let onMouseMove;
    let stopResize;

    const existingStyle = document.getElementById('omora-sidebar-style');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'omora-sidebar-style';
      style.textContent = `
        #omora-sidebar {
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          transition: width 0.5s;
        }
        #omora-sidebar .omora-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        #omora-sidebar.collapsed .omora-button .label {
          display: none;
        }
        #omora-sidebar .expand-toggle {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }
        #omora-sidebar .expand-toggle .icon {
          display: inline-block;
          transition: transform 0.5s;
          transform: rotate(180deg);
        }
        #omora-sidebar.collapsed .expand-toggle .icon {
          transform: rotate(0deg);
        }
      `;
      document.head.appendChild(style);
    }

    const updateSidebarState = () => {
      if (!sidebar) {
        return;
      }
      if (sidebar.offsetWidth <= 100) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    };

    const buttonConfigs = [];

    const createButton = ({ icon, label, onClick }) => {
      const btn = document.createElement('button');
      btn.className = 'omora-button';
      const iconSpan = document.createElement('span');
      iconSpan.className = 'icon';
      iconSpan.textContent = icon;
      const labelSpan = document.createElement('span');
      labelSpan.className = 'label';
      labelSpan.textContent = label;
      btn.append(iconSpan, labelSpan);
      if (onClick) {
        btn.addEventListener('click', onClick);
      }
      return btn;
    };

    const addButton = (config) => {
      buttonConfigs.push(config);
      if (buttonsContainer) {
        buttonsContainer.appendChild(createButton(config));
        updateSidebarState();
      }
    };

    window.omoraAddButton = addButton;

    addButton({ icon: '🏠', label: 'Home', onClick: () => console.log('Home clicked') });
    addButton({ icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings clicked') });

    const adjustBody = () => {
      if (sidebar) {
        body.style.marginRight = `${sidebar.offsetWidth}px`;
        updateSidebarState();
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

        const toggleButton = document.createElement('button');
        toggleButton.className = 'expand-toggle';
        toggleButton.style.marginLeft = '5px';
        const chevron = document.createElement('span');
        chevron.className = 'icon';
        chevron.textContent = '\u276F';
        toggleButton.appendChild(chevron);
        toggleButton.addEventListener('click', () => {
          const targetWidth = sidebar.offsetWidth > 100 ? 50 : 200;
          sidebar.style.width = `${targetWidth}px`;
          if (targetWidth <= 100) {
            sidebar.classList.add('collapsed');
          } else {
            sidebar.classList.remove('collapsed');
          }
        });
        sidebar.appendChild(toggleButton);

        buttonsContainer = document.createElement('div');
        buttonsContainer.style.marginLeft = '5px';
        sidebar.appendChild(buttonsContainer);

        buttonConfigs.forEach((cfg) => {
          buttonsContainer.appendChild(createButton(cfg));
        });

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
          sidebar.style.transition = '';
        };

        startResize = (e) => {
          isResizing = true;
          sidebar.style.transition = 'none';
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
        buttonsContainer = undefined;
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
