export default async function init(container) {
  // Background section
  const bgSection = document.createElement('div');
  bgSection.className = 'section';
  const bgTitle = document.createElement('h3');
  bgTitle.textContent = 'Background';
  bgSection.appendChild(bgTitle);

  const radioGroup = document.createElement('div');
  radioGroup.className = 'radio-group';

  const bgOptions = [
    { value: 'none', label: 'None' },
    { value: 'default', label: 'Default' },
    { value: 'custom', label: 'Custom' }
  ];

  bgOptions.forEach(({ value, label }) => {
    const lbl = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'chatgpt-bg';
    input.value = value;
    lbl.appendChild(input);
    lbl.appendChild(document.createTextNode(label));
    radioGroup.appendChild(lbl);
  });

  bgSection.appendChild(radioGroup);

  const customBg = document.createElement('div');
  customBg.id = 'custom-bg';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  customBg.appendChild(fileInput);
  bgSection.appendChild(customBg);

  const preview = document.createElement('div');
  preview.id = 'background-preview';
  bgSection.appendChild(preview);

  container.appendChild(bgSection);

  const bgRadios = radioGroup.querySelectorAll('input');

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

  const setBg = async (type) => {
    await chrome.storage.local.set({ omoraBgType: type });
    if (type !== 'custom') {
      await chrome.storage.local.remove('omoraBgImage');
    }
    const { omoraBgImage = '' } = await chrome.storage.local.get('omoraBgImage');
    applyBackground(type, omoraBgImage);
    customBg.classList.toggle('hidden', type !== 'custom');
  };

  bgRadios.forEach((radio) => {
    radio.addEventListener('change', () => setBg(radio.value));
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await chrome.storage.local.set({ omoraBgImage: reader.result, omoraBgType: 'custom' });
      radioGroup.querySelector('input[value="custom"]').checked = true;
      applyBackground('custom', reader.result);
      customBg.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  const { omoraBgType = 'default', omoraBgImage = '' } = await chrome.storage.local.get([
    'omoraBgType',
    'omoraBgImage'
  ]);
  const initialRadio = radioGroup.querySelector(`input[value="${omoraBgType}"]`);
  if (initialRadio) initialRadio.checked = true;
  applyBackground(omoraBgType, omoraBgImage);
  customBg.classList.toggle('hidden', omoraBgType !== 'custom');

  // Chatbubble color section
  const colorSection = document.createElement('div');
  colorSection.className = 'section';
  const colorTitle = document.createElement('h3');
  colorTitle.textContent = 'Chatbubble Color';
  colorSection.appendChild(colorTitle);

  const colorPreview = document.createElement('div');
  colorPreview.className = 'preview';
  colorSection.appendChild(colorPreview);

  const colorGrid = document.createElement('div');
  colorGrid.className = 'color-grid';
  colorSection.appendChild(colorGrid);

  const colors = ['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF5722', '#795548', '#607D8B'];

  const setColor = async (color) => {
    await chrome.storage.local.set({ omoraBubbleColor: color });
    colorPreview.style.backgroundColor = color;
    Array.from(colorGrid.children).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
  };

  colors.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'color-option';
    btn.style.backgroundColor = c;
    btn.dataset.color = c;
    btn.addEventListener('click', () => setColor(c));
    colorGrid.appendChild(btn);
  });

  container.appendChild(colorSection);

  const { omoraBubbleColor = '' } = await chrome.storage.local.get('omoraBubbleColor');
  if (omoraBubbleColor) {
    await setColor(omoraBubbleColor);
  }
}

