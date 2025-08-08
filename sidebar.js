(() => {
  try {
    const body = document.body;
    if (!body) return;

    let container;
    let panel;
    let iconsTop;
    let iconsBottom;
    let activeBtn;
    let panelWidth = 300;
    let isResizing = false;
    let mediaQuery;
    let startX = 0;
    let startWidth = 0;

    const buttonConfigs = [];
    const bottomButtonConfigs = [];

    const createButton = ({ icon, label, content, onClick }) => {
      const btn = document.createElement('button');
      btn.className = 'omora-btn';
      btn.innerHTML = icon;
      btn.title = label;
      btn.addEventListener('click', () => handleButtonClick(btn, content, onClick));
      return btn;
    };

    const handleButtonClick = (btn, content, onClick) => {
      if (activeBtn === btn) {
        closePanel();
        return;
      }
      if (activeBtn) {
        activeBtn.classList.remove('active');
      }
      activeBtn = btn;
      btn.classList.add('active');
      panel.innerHTML = '';
      panel.appendChild(resizeHandle);
      if (content) {
        const el = typeof content === 'function' ? content() : content;
        if (el) {
          panel.appendChild(el);
        }
      } else if (onClick) {
        onClick();
      }
      openPanel();
    };

    const openPanel = () => {
      container.classList.add('open');
      panel.style.width = panelWidth + 'px';
    };

    const closePanel = () => {
      container.classList.remove('open');
      panel.style.width = '0px';
      if (activeBtn) {
        activeBtn.classList.remove('active');
        activeBtn = undefined;
      }
    };

    const addButton = (config) => {
      const list = config.position === 'bottom' ? bottomButtonConfigs : buttonConfigs;
      list.push(config);
      const target = config.position === 'bottom' ? iconsBottom : iconsTop;
      if (target) {
        target.appendChild(createButton(config));
      }
    };

    window.omoraAddButton = addButton;
    if (Array.isArray(window.omoraPendingButtons)) {
      window.omoraPendingButtons.forEach(addButton);
      window.omoraPendingButtons = [];
    }

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = panelWidth;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stopResize);
      e.preventDefault();
    });

    const onMouseMove = (e) => {
      if (!isResizing) return;
      const delta = startX - e.clientX;
      panelWidth = Math.max(200, startWidth + delta);
      panel.style.width = panelWidth + 'px';
    };

    const stopResize = () => {
      if (!isResizing) return;
      isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };

    const applyTheme = (el) => {
      let theme = window.omoraForceTheme;
      if (theme !== "light" && theme !== "dark") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        theme = prefersDark ? "dark" : "light";
      }
      el.classList.add(theme === "dark" ? "omora-theme-dark" : "omora-theme-light");
    };

    const updateTheme = () => {
      if (!container) return;
      container.classList.remove("omora-theme-dark", "omora-theme-light");
      applyTheme(container);
    };

    const showSidebar = () => {
      if (container) return;
      container = document.createElement('div');
      container.id = 'omora-sidebar';

      panel = document.createElement('div');
      panel.className = 'omora-panel';
      panel.appendChild(resizeHandle);

      const icons = document.createElement('div');
      icons.className = 'omora-icons';
      iconsTop = document.createElement('div');
      iconsTop.className = 'icons-top';
      iconsBottom = document.createElement('div');
      iconsBottom.className = 'icons-bottom';
      icons.appendChild(iconsTop);
      icons.appendChild(iconsBottom);

      container.appendChild(panel);
      container.appendChild(icons);
      applyTheme(container);
      if (window.matchMedia) {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", updateTheme);
      }
      body.appendChild(container);

      buttonConfigs.forEach((cfg) => iconsTop.appendChild(createButton(cfg)));
      bottomButtonConfigs.forEach((cfg) => iconsBottom.appendChild(createButton(cfg)));
    };

    const hideSidebar = () => {
      if (!container) return;
      container.remove();
      container = undefined;
      panel = undefined;
      iconsTop = undefined;
      iconsBottom = undefined;
      activeBtn = undefined;
      if (mediaQuery) {
        mediaQuery.removeEventListener("change", updateTheme);
        mediaQuery = undefined;
      }
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

    addButton({
      icon: '⚙️',
      label: 'Settings',
      content: () => {
        const div = document.createElement('div');
        div.className = 'settings-panel';
        div.textContent = 'Settings';
        return div;
      },
      position: 'bottom',
    });
  } catch (e) {
    /* Fail silently */
  }
})();
