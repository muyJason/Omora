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
    let isEyedropperActive = false;
    let cancelEyedropper;

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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isEyedropperActive) {
          if (typeof cancelEyedropper === 'function') cancelEyedropper();
        } else {
          closePanel();
        }
      }
    });

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

    const createColorPicker = () => {
      const root = document.createElement('div');
      root.className = 'color-picker';
      const sv = document.createElement('div');
      sv.className = 'cp-sv';
      const cursor = document.createElement('div');
      cursor.className = 'cp-cursor';
      sv.appendChild(cursor);
      const hue = document.createElement('input');
      hue.type = 'range';
      hue.className = 'cp-hue';
      hue.min = '0';
      hue.max = '360';
      const rowPrev = document.createElement('div');
      rowPrev.className = 'row';
      const preview = document.createElement('div');
      preview.className = 'cp-preview';
      const eyeBtn = document.createElement('button');
      eyeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0L11 9.25l-4.96-4.96a1 1 0 00-1.41 0L2.29 6.29a1 1 0 000 1.41L7.25 12l-4.96 4.96a1 1 0 000 1.41l2.34 2.34a1 1 0 001.41 0L11 14.75l4.96 4.96a1 1 0 001.41 0l2.34-2.34a1 1 0 000-1.41L14.75 12l4.96-4.96a1 1 0 000-1.41z"/></svg>';
      rowPrev.appendChild(preview);
      rowPrev.appendChild(eyeBtn);
      const rowHex = document.createElement('div');
      rowHex.className = 'row';
      const hexInput = document.createElement('input');
      hexInput.type = 'text';
      hexInput.className = 'cp-hex';
      hexInput.maxLength = 7;
      const hexBtn = document.createElement('button');
      hexBtn.textContent = 'Copy HEX';
      rowHex.appendChild(hexInput);
      rowHex.appendChild(hexBtn);
      const rowRgb = document.createElement('div');
      rowRgb.className = 'row';
      const rgbInput = document.createElement('input');
      rgbInput.type = 'text';
      rgbInput.className = 'cp-rgb';
      const rgbBtn = document.createElement('button');
      rgbBtn.textContent = 'Copy RGB';
      rowRgb.appendChild(rgbInput);
      rowRgb.appendChild(rgbBtn);
      root.appendChild(sv);
      root.appendChild(hue);
      root.appendChild(rowPrev);
      root.appendChild(rowHex);
      root.appendChild(rowRgb);
      let h = 0;
      let s = 1;
      let v = 1;
      const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      const hexToRgb = (hex) => {
        const m = /^#?([0-9a-f]{6})$/i.exec(hex);
        if (!m) return;
        const int = parseInt(m[1], 16);
        return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
      };
      const rgbToHsv = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let hh;
        if (d === 0) hh = 0; else if (max === r) hh = ((g - b) / d + (g < b ? 6 : 0)) * 60; else if (max === g) hh = ((b - r) / d + 2) * 60; else hh = ((r - g) / d + 4) * 60;
        const ss = max === 0 ? 0 : d / max;
        return [hh, ss, max];
      };
      const hsvToRgb = (hh, ss, vv) => {
        const c = vv * ss;
        const x = c * (1 - Math.abs((hh / 60) % 2 - 1));
        const m = vv - c;
        let r, g, b;
        if (hh < 60) [r, g, b] = [c, x, 0];
        else if (hh < 120) [r, g, b] = [x, c, 0];
        else if (hh < 180) [r, g, b] = [0, c, x];
        else if (hh < 240) [r, g, b] = [0, x, c];
        else if (hh < 300) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
      };
      const update = () => {
        const rgb = hsvToRgb(h, s, v);
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        preview.style.background = hex;
        hexInput.value = hex;
        rgbInput.value = rgb.join(',');
        sv.style.background = `hsl(${h}, 100%, 50%)`;
        cursor.style.left = s * 100 + '%';
        cursor.style.top = (1 - v) * 100 + '%';
        hue.value = h;
        localStorage.setItem('omoraColorPickerColor', hex);
      };
      const setColor = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return;
        const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        h = hsv[0];
        s = hsv[1];
        v = hsv[2];
        update();
      };
      const onSv = (e) => {
        const rect = sv.getBoundingClientRect();
        s = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        v = 1 - clamp((e.clientY - rect.top) / rect.height, 0, 1);
        update();
      };
      sv.addEventListener('mousedown', (e) => {
        onSv(e);
        const move = (ev) => onSv(ev);
        const up = () => {
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
      });
      hue.addEventListener('input', () => {
        h = parseFloat(hue.value);
        update();
      });
      hexInput.addEventListener('input', () => setColor(hexInput.value));
      rgbInput.addEventListener('input', () => {
        const parts = rgbInput.value.split(',').map((n) => parseInt(n.trim(), 10));
        if (parts.length === 3 && parts.every((n) => !isNaN(n) && n >= 0 && n <= 255)) setColor(rgbToHex(parts[0], parts[1], parts[2]));
      });
      hexBtn.addEventListener('click', () => navigator.clipboard.writeText(hexInput.value));
      rgbBtn.addEventListener('click', () => navigator.clipboard.writeText(rgbInput.value));
      eyeBtn.addEventListener('click', () => {
        if (isEyedropperActive) return;
        if (window.EyeDropper) {
          const controller = new AbortController();
          cancelEyedropper = () => controller.abort();
          isEyedropperActive = true;
          new window.EyeDropper().open({ signal: controller.signal }).then(({ sRGBHex }) => setColor(sRGBHex)).catch(() => {}).finally(() => {
            isEyedropperActive = false;
            cancelEyedropper = undefined;
          });
        } else {
          isEyedropperActive = true;
          navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.style.position = 'absolute';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '100%';
            video.style.height = '100%';
            video.play();
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.cursor = 'crosshair';
            overlay.style.zIndex = '2147483647';
            overlay.appendChild(video);
            document.body.appendChild(overlay);
            const canvas = document.createElement('canvas');
            const stop = () => {
              stream.getTracks().forEach((t) => t.stop());
              overlay.remove();
              isEyedropperActive = false;
              cancelEyedropper = undefined;
            };
            cancelEyedropper = stop;
            overlay.addEventListener('click', (ev) => {
              const rect = overlay.getBoundingClientRect();
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const x = Math.round(ev.clientX * canvas.width / rect.width);
              const y = Math.round(ev.clientY * canvas.height / rect.height);
              const data = ctx.getImageData(x, y, 1, 1).data;
              setColor(rgbToHex(data[0], data[1], data[2]));
              stop();
            });
          }).catch(() => {
            isEyedropperActive = false;
            cancelEyedropper = undefined;
          });
        }
      });
      const saved = localStorage.getItem('omoraColorPickerColor');
      setColor(saved || '#ff0000');
      return root;
    };

    addButton({
      icon: '🎨',
      label: 'Color Picker',
      content: createColorPicker,
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
