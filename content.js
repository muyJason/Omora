// Content script for injecting and managing the Omora sidebar.
(async () => {
  const storageKey = `sidebarVisible:${location.hostname}`;

  const getVisibility = async () => {
    const result = await chrome.storage.local.get(storageKey);
    return result[storageKey];
  };

  const setVisibility = async (visible) => {
    await chrome.storage.local.set({ [storageKey]: visible });
  };

  let sidebar = document.getElementById('omora-sidebar');
  let sidebarVisible = true;
  let toggleButton = document.getElementById('omora-toggle-button');

  if (!sidebar) {
    sidebar = document.createElement('iframe');
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
    document.body.appendChild(sidebar);
  }

  const showSidebar = async () => {
    sidebar.style.display = 'block';
    document.body.style.marginRight = '400px';
    sidebarVisible = true;
    toggleButton.style.display = 'none';
    await setVisibility(true);
  };

  const hideSidebar = async () => {
    sidebar.style.display = 'none';
    document.body.style.marginRight = '0px';
    sidebarVisible = false;
    toggleButton.style.display = 'block';
    await setVisibility(false);
  };

  const toggleSidebar = () => {
    sidebarVisible ? hideSidebar() : showSidebar();
  };

  if (!toggleButton) {
    toggleButton = document.createElement('button');
    toggleButton.id = 'omora-toggle-button';
    toggleButton.textContent = 'Omora';
    Object.assign(toggleButton.style, {
      position: 'fixed',
      top: '50%',
      right: '0',
      transform: 'translateY(-50%)',
      zIndex: '2147483647',
      display: 'none',
      padding: '8px 4px',
      cursor: 'pointer',
      background: '#fff',
      border: '1px solid #ccc',
      borderRight: 'none',
      borderRadius: '4px 0 0 4px'
    });
    toggleButton.addEventListener('click', showSidebar);
    document.body.appendChild(toggleButton);
  }

  const storedVisibility = await getVisibility();
  if (storedVisibility === false) {
    await hideSidebar();
  } else {
    await showSidebar();
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'hide-sidebar') {
      hideSidebar();
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === 'toggle-sidebar') {
      toggleSidebar();
    }
  });
})();
