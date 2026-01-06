export const ADMIN_ROUTER_PATHS = {
    GET_ALL_NOTIFICATIONS: "/admin/api/v1/admin/notification/all",
    DELETE_NOTIFICATION: (id: string) => `/api/v1/admin/notification/delete/${id}`,
    GET_PAGED_NOTIFICATIONS: "/admin/api/v1/admin/notification/paged"
} as const;
