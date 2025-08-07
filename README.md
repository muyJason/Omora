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
  width between 50px and 200px over 0.5s and rotates its chevron icon
  180° to indicate the state.
