document.addEventListener('DOMContentLoaded', () => {
  const hideButton = document.getElementById('hide-sidebar-btn');
  if (hideButton) {
    hideButton.addEventListener('click', () => {
      parent.postMessage({ type: 'hide-sidebar' }, '*');
    });
  }
});
