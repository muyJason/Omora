(() => {
  try {
    const body = document.body;
    if (!body) {
      return;
    }

    const sidebar = document.createElement('div');
    sidebar.id = 'omora-sidebar';
    Object.assign(sidebar.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '300px',
      height: '100vh',
      backgroundColor: '#fff',
      borderLeft: '1px solid #ccc',
      zIndex: '2147483647',
      overflow: 'auto',
      resize: 'horizontal',
      minWidth: '150px',
      maxWidth: '80vw'
    });

    body.appendChild(sidebar);

    const adjustBody = () => {
      body.style.marginRight = `${sidebar.offsetWidth}px`;
    };
    adjustBody();

    const observer = new ResizeObserver(adjustBody);
    observer.observe(sidebar);
  } catch (e) {
    /* Fail silently on restricted pages */
  }
})();
