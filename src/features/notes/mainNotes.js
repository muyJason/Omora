const container = document.getElementById("notes-container")
const textarea = document.getElementById("notes-text")

async function init() {
  const origin = new URL(location.href).origin
  const key = `omora:notes:${origin}`
  const data = await chrome.storage.sync.get(key)
  textarea.value = data[key] || ""

  let t
  textarea.addEventListener("input", () => {
    clearTimeout(t)
    t = setTimeout(() => {
      const v = {}
      v[key] = textarea.value
      chrome.storage.sync.set(v)
    }, 300)
  })
}

init()
