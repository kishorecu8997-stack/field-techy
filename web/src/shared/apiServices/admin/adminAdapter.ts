import axiosInstance from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import type {
    AdminNotification,
    PagedNotificationsParams,
    PagedNotificationsResponse
} from './adminTypes';

export class AdminAdapter {

    // Delete Notification
    static async DeleteNotification(id: string): Promise<{ message: string }> {
        const response = await axiosInstance.delete(
            ADMIN_ROUTER_PATHS.DELETE_NOTIFICATION(id)
        );
        return response.data;
    }

    // Get All Notifications
    static async GetAllNotifications(): Promise<AdminNotification[]> {
        const response = await axiosInstance.get(
            ADMIN_ROUTER_PATHS.GET_ALL_NOTIFICATIONS
        );
        return response.data;
    }

    // Get Paged Notifications
  static async GetPagedNotifications(
    params: PagedNotificationsParams
  ): Promise<PagedNotificationsResponse> {
    const { page, size, sortBy = "createdAt", direction = "DESC" } = params;
    const response = await axiosInstance.get(ADMIN_ROUTER_PATHS.GET_PAGED_NOTIFICATIONS, {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

} 
