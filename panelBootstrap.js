async function init() {
  const contexts = await chrome.runtime.getContexts({ contextTypes: ['SIDE_PANEL'] })
  const tabId = contexts[0] && contexts[0].tabId
  if (!tabId) return
  const key = 'omora:feature:' + tabId
  const data = await chrome.storage.session.get(key)
  const feature = data[key]
  if (!feature) return
  const select = () => {
    const btn = document.querySelector(`.om-rail__icon[data-id="${feature}"]`)
    if (btn) {
      btn.click()
    } else {
      requestAnimationFrame(select)
    }
  }
  select()
}
document.addEventListener('DOMContentLoaded', init)
