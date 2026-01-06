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
export interface PagedNotificationsParams {
  page: number;
  size: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

export interface PagedNotificationsResponse {
  content: AdminNotification[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
export type AdminData = {
    phoneOrEmail: string;
    password: string;
}