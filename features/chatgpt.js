export default function init(container, domain) {
  const prefix = `omora_${domain}_`;

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
    input.name = `${domain}-bg`;
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

  const setBg = (type) => {
    localStorage.setItem(`${prefix}bgType`, type);
    if (type !== 'custom') {
      localStorage.removeItem(`${prefix}bgImage`);
    }
    applyBackground(type, localStorage.getItem(`${prefix}bgImage`));
    customBg.classList.toggle('hidden', type !== 'custom');
  };

  bgRadios.forEach((radio) => {
    radio.addEventListener('change', () => setBg(radio.value));
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem(`${prefix}bgImage`, dataUrl);
      localStorage.setItem(`${prefix}bgType`, 'custom');
      radioGroup.querySelector(`input[value="custom"]`).checked = true;
      applyBackground('custom', dataUrl);
      customBg.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  const savedBgType = localStorage.getItem(`${prefix}bgType`) || 'default';
  const savedBgImage = localStorage.getItem(`${prefix}bgImage`);
  const initialRadio = radioGroup.querySelector(`input[value="${savedBgType}"]`);
  if (initialRadio) initialRadio.checked = true;
  applyBackground(savedBgType, savedBgImage);
  customBg.classList.toggle('hidden', savedBgType !== 'custom');

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

  const colors = ['#ffffff', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

  const setColor = (color) => {
    localStorage.setItem(`${prefix}bubbleColor`, color);
    colorPreview.style.backgroundColor = color;
    Array.from(colorGrid.children).forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.color === color);
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

  const savedColor = localStorage.getItem(`${prefix}bubbleColor`) || colors[0];
  setColor(savedColor);

  container.appendChild(colorSection);
}
