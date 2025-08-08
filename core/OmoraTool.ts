export interface OmoraTool {
  id: string
  icon: string
  tooltip: string
  execute(container: HTMLElement): void
  onOpen?(): void
  onClose?(): void
}
