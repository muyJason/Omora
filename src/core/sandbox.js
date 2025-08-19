export function createSandboxedIframe(src) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.className = 'om-iframe';
  iframe.src = src;
  return iframe;
}
