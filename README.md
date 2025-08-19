# Omora

Minimal Chrome extension.

## Features

- Plugin-based sidebar with command manager
- Fixed 30px icon bar with tooltips
- Resizable 200ms animated tool panel
- Built-in Color Picker plugin storing the last color
- Tool panels open on icon click and run their tools
- Toggle sidebar by clicking the Omora extension icon
- Dark themed sidebar
- Sidebar resources exposed via `web_accessible_resources` so the extension opens correctly

## Development

Tools live in `tools/<ToolName>` and implement the `OmoraTool` interface. The `SidebarManager` handles tool registration and panel display. Register tools in `tools/index.ts` and the manager is created and all tools are registered at startup in `sidebar.js`.
Ensure any modules or styles loaded with `chrome.runtime.getURL` are declared under `web_accessible_resources` in `manifest.json`.
