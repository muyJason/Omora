
export type MessageType =
  | 'activate'
  | 'deactivate'
  | 'resize'
  | 'error'
  | `feature:event:${string}`;

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
}
