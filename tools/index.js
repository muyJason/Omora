import { ColorPickerTool } from './ColorPicker/index.js'

export function registerAllTools(sidebarManager) {
  sidebarManager.registerTool(new ColorPickerTool())
}
