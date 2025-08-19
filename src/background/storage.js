export function getState(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (items) => {
      resolve(items[key] ?? null);
    });
  });
}

export function setState(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}
