export async function loadRegistry() {
  const features = ['colorpicker', 'notes']
  const metas = []
  for (const f of features) {
    try {
      const url = chrome.runtime.getURL(`src/features/${f}/metadata.json`)
      const res = await fetch(url)
      if (!res.ok) continue
      metas.push(await res.json())
    } catch (_) {}
  }
  return metas
}
