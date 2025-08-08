document.addEventListener('DOMContentLoaded', async () => {
  const bgRadios = document.querySelectorAll('input[name="background"]');
  const customBgSection = document.getElementById('custom-bg');
  const fileInput = document.getElementById('bg-file');
  const preview = document.getElementById('background-preview');
  const colorButtons = document.querySelectorAll('.color-option');

  const { omoraBgType = 'default', omoraBgImage = '', omoraBubbleColor = '' } =
    await chrome.storage.local.get(['omoraBgType','omoraBgImage','omoraBubbleColor']);

  const applyBackground = (type, image) => {
    if (type === 'custom' && image) { preview.style.backgroundImage = `url(${image})`; preview.style.backgroundColor = ''; }
    else if (type === 'none') { preview.style.backgroundImage = ''; preview.style.backgroundColor = 'transparent'; }
    else { preview.style.backgroundImage = ''; preview.style.backgroundColor = ''; }
  };

  const setBg = async (type) => {
    await chrome.storage.local.set({ omoraBgType: type });
    if (type !== 'custom') await chrome.storage.local.remove('omoraBgImage');
    applyBackground(type, (await chrome.storage.local.get('omoraBgImage')).omoraBgImage);
    customBgSection.classList.toggle('hidden', type !== 'custom');
  };

  bgRadios.forEach(r => r.addEventListener('change', () => setBg(r.value)));
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = async () => {
      await chrome.storage.local.set({ omoraBgImage: rd.result });
      applyBackground('custom', rd.result);
    };
    rd.readAsDataURL(f);
  });

  const setColor = async (c) => {
    await chrome.storage.local.set({ omoraBubbleColor: c });
    document.querySelectorAll('.color-option').forEach(b => b.classList.toggle('active', b.dataset.color === c));
  };
  colorButtons.forEach(b => b.addEventListener('click', () => setColor(b.dataset.color)));

  const initial = document.querySelector(`input[name="background"][value="${omoraBgType}"]`);
  if (initial) initial.checked = true;
  customBgSection.classList.toggle('hidden', omoraBgType !== 'custom');
  applyBackground(omoraBgType, omoraBgImage);
  if (omoraBubbleColor) await setColor(omoraBubbleColor);
});
