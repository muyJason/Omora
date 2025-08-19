# Omora

Omora Chrome extension.

## Development
The side panel UI is written in TypeScript. It presents a fixed rail on the right and a content shell on the left with a header showing the active feature name and a close button. The panel can collapse to leave only the rail visible and this state persists in `chrome.storage.local`.

## Styling
Core styles provide a dark theme with system UI fonts, an icon rail, and a collapsible panel. Components animate with 180ms transitions and include focus rings for accessibility.

## Rail Icons
The rail now uses semantic toolbar and button elements. Each icon button exposes a native tooltip and ARIA label, and the active
icon is highlighted with a subtle accent background and left border glow.
