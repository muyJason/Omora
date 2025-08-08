# Omora

Minimal Chrome extension.

## Features

- Sidebar on the right side of webpages resizable by dragging its left edge (minimum width 50px).
- Toggle the sidebar by clicking the Omora extension icon; visibility
  is synchronized across all tabs and windows.
- The sidebar defaults to roughly 300px wide, shrinks page content to
  accommodate its width, and stays hidden on restricted pages.
- Scaffold for sidebar buttons. Buttons show their icon and label when
  the sidebar exceeds 100px and collapse to icons only when narrower.
  New buttons can be added at runtime via `window.omoraAddButton`.
- Expand/Collapse toggle button at the top. It animates the sidebar
  width between 50px and 200px over 0.5s, shows a "Collaps" label when
  expanded, and rotates its chevron icon 180° to indicate the state.
- Icons (including the chevron) center themselves when the sidebar is
  collapsed so the toggle aligns with other buttons.
- A persistent Settings button is anchored to the bottom of the sidebar.
- Styling for the sidebar lives in a dedicated `sidebar.css` file for
  easier customization.
- Automatically selects a light or dark sidebar theme with the following
  priority: a global `window.omoraForceTheme` override, the user's
  operating system dark mode preference, and finally the page's
  background color. The chosen theme updates on-the-fly when the page or
  system theme changes. Text color is picked to maintain WCAG AA
  contrast against the detected background (white text for dark
  backgrounds, black text for light backgrounds). A default dark
  background is used when dark mode is active.
- All sidebar text and the chevron icon switch between white and black
  according to the selected theme.
- Scrollbars inside the sidebar are hidden for a cleaner appearance.
- "Appearance" settings tab lets you set a custom background image or chat
  bubble color with live preview and localStorage persistence.
