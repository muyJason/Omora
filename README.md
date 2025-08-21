# Omora

Omora Chrome extension.

## ISidebar
Each page injects a draggable rail on the right edge with buttons for Notes and Color Picker. Clicking an icon opens the Omora side panel for that feature. The rail is rendered outside the panel.

## Development
The side panel UI is written in JavaScript. It presents a content shell on the left. A dynamic header is created in code with an `#om-title` span and `#om-close` button. Clicking close collapses the shell and the collapsed state persists in `chrome.storage.local`.

### Keyboard Shortcuts
- Left-click the Omora extension icon to open the panel.
- **Ctrl+Shift+O** toggles the panel.

## Styling
Core styles provide a dark theme with system UI fonts and a collapsible panel. Components animate with 180ms transitions and include focus rings for accessibility. Feature iframes mount inside a padded `.om-panel__host` so content doesn't touch the panel edges.

## Rail Icons
The rail uses semantic toolbar and button elements. Each icon button exposes a native tooltip and ARIA label, and the active icon is highlighted with an outline.

## Notes
A quick scratchpad for jotting down thoughts while browsing.

## Color Picker
A dark themed color picker offers a saturation/value canvas, hue and alpha sliders, HEX and RGBA inputs, a preview swatch, and copyable RGBA, HEX, HSV, and CMYK values. The pipette button uses the EyeDropper API when available.
