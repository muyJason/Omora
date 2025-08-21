async function activeTabId() {
  try {
    const ctx = await chrome.runtime.getContexts({ contextTypes: ['SIDE_PANEL'] })
    if (ctx?.[0]?.tabId) return ctx[0].tabId
  } catch (_) {}
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true })
  return t?.id
}

function waitSelector(sel, timeout = 8000) {
  return new Promise((res, rej) => {
    const t0 = performance.now()
    ;(function loop() {
      const el = document.querySelector(sel)
      if (el) return res(el)
      if (performance.now() - t0 > timeout) return rej(new Error('timeout'))
      requestAnimationFrame(loop)
    })()
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const tabId = await activeTabId()
  if (!tabId) return
  const key = 'omora:feature:' + tabId
  const data = await chrome.storage.session.get(key)
  const id = data[key]
  if (!id) return
  try {
    const btn = await waitSelector(`.om-rail__icon[data-id="${id}"]`)
    btn.click()
    await chrome.storage.session.remove(key)
  } catch (_) {}
})
