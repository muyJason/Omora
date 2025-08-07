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

        handle = document.createElement('div');
        handle.className = 'resize-handle';
        sidebar.appendChild(handle);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'expand-toggle';
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
        buttonsContainer.className = 'buttons-container';
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
