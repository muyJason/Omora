(() => {
  const config = {
    icon: '🤖',
    label: 'ChatGPT',
    onClick: () => console.log('ChatGPT-specific action'),
  };

  if (window.omoraAddButton) {
    window.omoraAddButton(config);
  } else {
    window.omoraPendingButtons = window.omoraPendingButtons || [];
    window.omoraPendingButtons.push(config);
  }
})();
