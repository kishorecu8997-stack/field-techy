export type AdminData = {
    phoneOrEmail: string;
    password: string;
}
export interface CreateNotificationParams {
    title: string;
    message: string;
    type: string;
    sendTo: string;
}

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    sendTo: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateNotificationParams {
  id: string;
  title: string;
  message: string;
  type: string;
  sendTo: string;
}
