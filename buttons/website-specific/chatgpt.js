(() => {
  const defaultBgHtml = `
<picture class="absolute inset-0 h-full w-full overflow-hidden" style="opacity: 1;">
  <source type="image/webp" srcset="https://persistent.oaistatic.com/burrito-nux/640.webp 640w, https://persistent.oaistatic.com/burrito-nux/1280.webp 1280w, https://persistent.oaistatic.com/burrito-nux/1920.webp 1920w">
  <img class="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-5b blur-2xl dark:opacity-30" alt="" aria-hidden="true" sizes="100vw" loading="eager" fetchpriority="high" srcset="https://persistent.oaistatic.com/burrito-nux/640.webp 640w, https://persistent.oaistatic.com/burrito-nux/1280.webp 1280w, https://persistent.oaistatic.com/burrito-nux/1920.webp 1920w" src="https://persistent.oaistatic.com/burrito-nux/640.webp">
  <div class="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-white dark:to-black"></div>
</picture>`;

  let settingsMenu;
  let bgContainer;

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#1a535c',
    '#ffe66d',
    '#f7fff7',
    '#a29bfe',
    '#fdcb6e',
    '#00b894',
    '#6c5ce7',
    '#d63031',
  ];

  const ensureBgContainer = () => {
    if (!bgContainer) {
      bgContainer = document.createElement('div');
      bgContainer.id = 'omora-bg-container';
      Object.assign(bgContainer.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '-1',
        pointerEvents: 'none',
      });
      document.body.prepend(bgContainer);
    }
    return bgContainer;
  };

  const applyBackground = (mode, file) => {
    if (mode === 'none') {
      if (bgContainer) {
        bgContainer.remove();
        bgContainer = undefined;
      }
      document.body.style.background = '';
      return;
    }

    const container = ensureBgContainer();
    document.body.style.background = 'transparent';

    if (mode === 'default') {
      container.style.backgroundImage = '';
      container.innerHTML = defaultBgHtml;
      return;
    }

    if (mode === 'custom' && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        container.innerHTML = '';
        container.style.backgroundImage = `url(${e.target.result})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(file);
    }
  };

  const createSettingsMenu = () => {
    settingsMenu = document.createElement('div');
    settingsMenu.id = 'omora-chatgpt-settings';
    Object.assign(settingsMenu.style, {
      position: 'fixed',
      top: '60px',
      right: '60px',
      background: '#fff',
      color: '#000',
      padding: '10px',
      zIndex: '9999',
      border: '1px solid #ccc',
      borderRadius: '4px',
      display: 'none',
      maxWidth: '250px',
      fontFamily: 'sans-serif',
      fontSize: '14px',
    });

    settingsMenu.innerHTML = `
      <h3 style="margin:0 0 10px">ChatGPT Settings</h3>
      <div style="margin-bottom:10px">
        <div style="margin-bottom:5px">Background:</div>
        <label style="display:block"><input type="radio" name="omora-bg" value="none" checked> None</label>
        <label style="display:block"><input type="radio" name="omora-bg" value="default"> Default</label>
        <label style="display:block"><input type="radio" name="omora-bg" value="custom"> Custom</label>
        <input type="file" id="omora-bg-upload" accept="image/*" style="display:none;margin-top:5px" />
      </div>
      <div>
        <div style="margin-bottom:5px">Chat bubble color:</div>
        <div id="omora-color-grid" style="display:grid;grid-template-columns:repeat(5,20px);gap:5px"></div>
      </div>
    `;

    document.body.appendChild(settingsMenu);

    const bgRadios = settingsMenu.querySelectorAll('input[name="omora-bg"]');
    const fileInput = settingsMenu.querySelector('#omora-bg-upload');

    bgRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.value === 'custom') {
          fileInput.style.display = 'block';
          if (fileInput.files[0]) {
            applyBackground('custom', fileInput.files[0]);
          }
        } else {
          fileInput.style.display = 'none';
          applyBackground(radio.value);
        }
      });
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) {
        applyBackground('custom', fileInput.files[0]);
      }
    });

    const grid = settingsMenu.querySelector('#omora-color-grid');
    colors.forEach((color) => {
      const sq = document.createElement('div');
      Object.assign(sq.style, {
        width: '20px',
        height: '20px',
        background: color,
        cursor: 'pointer',
        border: '1px solid #000',
      });
      sq.addEventListener('click', () => {
        document.documentElement.style.setProperty('--darkreader-bg--theme-user-msg-bg', color);
      });
      grid.appendChild(sq);
    });
  };

  const toggleSettings = () => {
    if (!settingsMenu) {
      createSettingsMenu();
    }
    settingsMenu.style.display = settingsMenu.style.display === 'none' || !settingsMenu.style.display ? 'block' : 'none';
  };

  const config = {
    icon: '🤖',
    label: 'ChatGPT',
    onClick: toggleSettings,
  };

  if (window.omoraAddButton) {
    window.omoraAddButton(config);
  } else {
    window.omoraPendingButtons = window.omoraPendingButtons || [];
    window.omoraPendingButtons.push(config);
  }
})();

