(function() {
  'use strict';
  const CHAT_CONTAINER_SELECTOR = 'main';
  const USER_BUBBLE_SELECTOR = '[data-message-author-role="user"], .user, [class*="user"]';

  const getChatContainer = () => document.querySelector(CHAT_CONTAINER_SELECTOR);

  async function readState() {
    return await chrome.storage.local.get(['omoraBgType','omoraBgImage','omoraBubbleColor']);
  }

  async function applyBackground() {
    const el = getChatContainer(); if (!el) return;
    const { omoraBgType = 'default', omoraBgImage = '' } = await readState();
    if (omoraBgType === 'custom' && omoraBgImage) { el.style.backgroundImage = `url(${omoraBgImage})`; el.style.backgroundColor = ''; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
    else if (omoraBgType === 'none') { el.style.backgroundImage = ''; el.style.backgroundColor = 'transparent'; }
    else { el.style.backgroundImage = ''; el.style.backgroundColor = ''; }
  }

  async function applyChatBubbleColor() {
    const { omoraBubbleColor = '' } = await readState();
    if (!omoraBubbleColor) return;
    document.querySelectorAll(USER_BUBBLE_SELECTOR).forEach(b => { b.style.backgroundColor = omoraBubbleColor; });
  }

  function observeMessages() {
    const root = document.body;
    if (!root) return;
    const mo = new MutationObserver(() => applyChatBubbleColor());
    mo.observe(root, { childList: true, subtree: true });
  }

  function listenStorage() {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.omoraBgType || changes.omoraBgImage) applyBackground();
      if (changes.omoraBubbleColor) applyChatBubbleColor();
    });
  }

  async function init() {
    await applyBackground();
    await applyChatBubbleColor();
    observeMessages();
    listenStorage();
  }

  init();
})();
