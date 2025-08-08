// Content script to inject appearance settings on ChatGPT pages
(function() {
  'use strict';

  const CHAT_CONTAINER_SELECTOR = 'main';
  const USER_BUBBLE_SELECTOR = '[data-message-author-role="user"], .user, [class*="user"]';

  function getChatContainer() {
    return document.querySelector(CHAT_CONTAINER_SELECTOR);
  }

  function applyBackground() {
    const container = getChatContainer();
    if (!container) return;

    const type = localStorage.getItem('omoraBgType');
    if (type === 'none') {
      container.style.backgroundImage = 'none';
      container.style.backgroundColor = '#ffffff';
    } else if (type === 'custom') {
      const img = localStorage.getItem('omoraBgImage');
      if (img) {
        container.style.backgroundImage = `url(${img})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundColor = '';
      }
    } else {
      container.style.backgroundImage = '';
      container.style.backgroundColor = '';
    }
  }

  function applyChatBubbleColor() {
    const color = localStorage.getItem('omoraBubbleColor');
    if (!color) return;

    const bubbles = document.querySelectorAll(USER_BUBBLE_SELECTOR);
    bubbles.forEach(b => {
      b.style.backgroundColor = color;
    });
  }

  function observeMessages() {
    const container = getChatContainer();
    if (!container) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          if (node.matches && node.matches(USER_BUBBLE_SELECTOR)) {
            node.style.backgroundColor = localStorage.getItem('omoraBubbleColor') || '';
          }

          if (node.querySelectorAll) {
            const bubbles = node.querySelectorAll(USER_BUBBLE_SELECTOR);
            bubbles.forEach(b => {
              b.style.backgroundColor = localStorage.getItem('omoraBubbleColor') || '';
            });
          }
        });
      });
    });

    observer.observe(container, { childList: true, subtree: true });
  }

  function initAppearance() {
    applyBackground();
    applyChatBubbleColor();
    observeMessages();

    window.addEventListener('storage', e => {
      if (['omoraBgType', 'omoraBgImage', 'omoraBubbleColor'].includes(e.key)) {
        applyBackground();
        applyChatBubbleColor();
      }
    });
  }

  initAppearance();
})();
