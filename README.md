# Omora

Omora Chrome extension.

## Development
The side panel UI is written in TypeScript. It presents a fixed rail on the right and a content shell on the left. A dynamic header is created in code with an `#om-title` span and `#om-close` button. Clicking close collapses the shell to leave only the rail visible and the collapsed state persists in `chrome.storage.local`.

### Keyboard Shortcuts
- Left-click the Omora extension icon to open the panel.
- **Ctrl+Shift+O** toggles the panel.
- **Ctrl+Alt+DigitN** focuses and activates the Nth feature in the rail.

## Styling
Core styles provide a dark theme with system UI fonts, an icon rail, and a collapsible panel. Components animate with 180ms transitions and include focus rings for accessibility. Feature iframes mount inside a padded `.om-panel__host` so content doesn't touch the panel edges.

## Rail Icons
The rail now uses semantic toolbar and button elements. Each icon button exposes a native tooltip and ARIA label, and the active
icon is highlighted with a subtle accent background and left border glow.
