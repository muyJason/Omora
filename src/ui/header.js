let titleEl;
export function setTitle(text) {
  if (titleEl) {
    titleEl.textContent = text;
  }
}
export function buildHeader() {
  const header = document.createElement('div');
  header.className = 'om-header';
  const title = document.createElement('span');
  title.id = 'om-title';
  title.className = 'om-title';
  titleEl = title;
  const close = document.createElement('button');
  close.id = 'om-close';
  close.className = 'om-close';
  close.setAttribute('aria-label', 'Close');
  header.append(title, close);
  return header;
}
