export async function loadRegistry() {
  const metas = [];
  try {
    const url = chrome.runtime.getURL('src/features/colorpicker/metadata.json');
    const res = await fetch(url);
    const meta = await res.json();
    metas.push(meta);
  } catch (_e) {
  }
  return metas;
}
