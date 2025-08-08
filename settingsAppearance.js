document.addEventListener('DOMContentLoaded', () => {
  const bgRadios = document.querySelectorAll('input[name="background"]');
  const customBgSection = document.getElementById('custom-bg');
  const fileInput = document.getElementById('bg-file');
  const preview = document.getElementById('background-preview');
  const colorButtons = document.querySelectorAll('.color-option');

  const applyBackground = (type, image) => {
    if (type === 'custom' && image) {
      preview.style.backgroundImage = `url(${image})`;
      preview.style.backgroundColor = '';
    } else if (type === 'none') {
      preview.style.backgroundImage = '';
      preview.style.backgroundColor = 'transparent';
    } else {
      preview.style.backgroundImage = '';
      preview.style.backgroundColor = '';
    }
  };

  const setBg = (type) => {
    localStorage.setItem('omoraBgType', type);
    if (type !== 'custom') {
      localStorage.removeItem('omoraBgImage');
    }
    applyBackground(type, localStorage.getItem('omoraBgImage'));
    customBgSection.classList.toggle('hidden', type !== 'custom');
  };

  bgRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      setBg(radio.value);
    });
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem('omoraBgImage', dataUrl);
      localStorage.setItem('omoraBgType', 'custom');
      document.querySelector('input[value="custom"]').checked = true;
      applyBackground('custom', dataUrl);
    };
    reader.readAsDataURL(file);
  });

  const setColor = (color) => {
    localStorage.setItem('omoraBubbleColor', color);
    document.documentElement.style.setProperty('--chatbubble-color', color);
    colorButtons.forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.color === color);
    });
  };

  colorButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setColor(btn.dataset.color);
    });
  });

  const savedBgType = localStorage.getItem('omoraBgType') || 'default';
  const savedBgImage = localStorage.getItem('omoraBgImage');
  const savedColor = localStorage.getItem('omoraBubbleColor');

  const initialRadio = document.querySelector(`input[name="background"][value="${savedBgType}"]`);
  if (initialRadio) {
    initialRadio.checked = true;
  }
  customBgSection.classList.toggle('hidden', savedBgType !== 'custom');
  applyBackground(savedBgType, savedBgImage);

  if (savedColor) {
    setColor(savedColor);
  }
});
