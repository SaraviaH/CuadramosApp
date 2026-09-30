export type NotificationKind = 'success' | 'error' | 'info';

export interface NotificationMessage {
  kind: NotificationKind;
  message: string;
}

export const notificationService = {
  success: (message: string): NotificationMessage => ({ kind: 'success', message }),
  error: (message: string): NotificationMessage => ({ kind: 'error', message }),
  info: (message: string): NotificationMessage => ({ kind: 'info', message }),
};
