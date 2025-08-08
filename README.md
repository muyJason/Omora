# Omora

Minimal Chrome extension.

## Features

- Plugin-based sidebar with command manager
- Fixed 30px icon bar with tooltips
- Resizable 200ms animated tool panel
- Built-in Color Picker plugin storing the last color
- Toggle sidebar by clicking the Omora extension icon
- Dark themed sidebar

## Development

Tools live in `tools/<ToolName>` and implement the `OmoraTool` interface. The `SidebarManager` handles tool registration and panel display. Register tools in `tools/index.ts` and initialize the manager in `sidebar.js`.
