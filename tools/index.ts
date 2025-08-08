import { SidebarManager } from '../core/SidebarManager'
import { ColorPickerTool } from './ColorPicker'

export function registerAllTools(sidebarManager: SidebarManager) {
  sidebarManager.registerTool(new ColorPickerTool())
}
