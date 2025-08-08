# Omora

Minimal Chrome extension.

## Features

- Fixed 30px icon sidebar on the right side of webpages. Icons display tooltips and never show text labels.
- Toggle the sidebar by clicking the Omora extension icon; visibility is synchronized across all tabs and windows.
- Clicking an icon expands a content panel to the left starting at 300px. The panel can be resized horizontally while the icon strip remains fixed.
- Smooth animation for expanding and collapsing. Clicking the active icon closes the panel; selecting another icon swaps the panel content without collapsing.
- New buttons can be added at runtime via `window.omoraAddButton`.
- Website-specific buttons. Each site can provide its own button configuration through scripts in `buttons/website-specific`. The ChatGPT implementation adds a button on `chatgpt.com` that opens a settings menu where users can switch between no background, the default image, or a custom uploaded picture, and choose chat bubble colors from a grid of swatches.
- A persistent Settings button is anchored to the bottom of the icon strip.
- Styling for the sidebar lives in a dedicated `sidebar.css` file for easier customization.
- Automatically selects a light or dark sidebar theme with priority: a global `window.omoraForceTheme` override and the user's operating system dark mode preference. The theme updates when the system preference changes.
- All sidebar text switches between white and black according to the selected theme.
- Scrollbars inside the sidebar are hidden for a cleaner appearance.
