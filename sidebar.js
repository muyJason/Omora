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
    let bottomButtonsContainer;
    let isResizing = false;
    let startResize;
    let onMouseMove;
    let stopResize;
    let detectedBg;
    let themeClass;
    let themeComputed = false;

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
    const bottomButtonConfigs = [];

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
      const list = config.position === 'bottom' ? bottomButtonConfigs : buttonConfigs;
      list.push(config);
      const container = config.position === 'bottom' ? bottomButtonsContainer : buttonsContainer;
      if (container) {
        container.appendChild(createButton(config));
        updateSidebarState();
      }
    };

    window.omoraAddButton = addButton;

    addButton({ icon: '🏠', label: 'Home', onClick: () => console.log('Home clicked') });
    addButton({ icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings clicked'), position: 'bottom' });

    const detectTheme = () => {
      if (themeComputed) {
        return;
      }
      themeComputed = true;
      const force = window.omoraForceTheme;
      if (force === 'light' || force === 'dark') {
        themeClass = force === 'light' ? 'omora-theme-light' : 'omora-theme-dark';
        if (themeClass === 'omora-theme-dark') {
          detectedBg = '#1e1e1e';
        }
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        themeClass = 'omora-theme-dark';
        detectedBg = '#1e1e1e';
        return;
      }
      let bg = getComputedStyle(body).backgroundColor;
      if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
        bg = getComputedStyle(document.documentElement).backgroundColor;
      }
      detectedBg = bg;
      const match = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        themeClass = brightness < 128 ? 'omora-theme-light' : 'omora-theme-dark';
      }
      if (themeClass === 'omora-theme-dark' && (!detectedBg || detectedBg === 'transparent' || detectedBg === 'rgba(0, 0, 0, 0)')) {
        detectedBg = '#1e1e1e';
      }
    };

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
        detectTheme();
        sidebar = document.createElement('div');
        sidebar.id = 'omora-sidebar';
        if (detectedBg) {
          sidebar.style.backgroundColor = detectedBg;
        }
        if (themeClass) {
          sidebar.classList.add(themeClass);
        }

        handle = document.createElement('div');
        handle.className = 'resize-handle';
        sidebar.appendChild(handle);

        const toggleButton = createButton({ icon: '\u276F', label: 'Collaps' });
        toggleButton.classList.add('expand-toggle');
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

        bottomButtonsContainer = document.createElement('div');
        bottomButtonsContainer.className = 'bottom-buttons';
        sidebar.appendChild(bottomButtonsContainer);

        buttonConfigs.forEach((cfg) => {
          buttonsContainer.appendChild(createButton(cfg));
        });

        bottomButtonConfigs.forEach((cfg) => {
          bottomButtonsContainer.appendChild(createButton(cfg));
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
        bottomButtonsContainer = undefined;
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
