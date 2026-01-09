/*For Admin SignUp, SignIn, Retrieve, Delete */
export const ADMIN_ROUTER_PATHS = {
  SIGNIN: "/user/api/v1/users/adm/signin",
  FORGOTPASSWORD_OTP_REQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/otp/request/${phoneOrEmail}`,
  RESET_PASSWORD_USING_OTP: (otp: string) =>
    `/user/api/v1/users/password/reset/by-otp/${otp}`,
  ADMIN_PROFILE_UPDATE: (id: string) => `/admin/api/v1/admin/update/${id}`,
  ADMIN_CHANGE_PASSWORD: "/user/api/v1/users/password/change",
  ADMIN_FILE_UPLOAD: (adminId: string, fileType: string) =>
    `/admin/api/v1/admin/files/${adminId}/${fileType}/upload`,
  DOWNLOAD_FILE_STREAM: (fileKey: string) =>
    `/admin/api/v1/admin/files/download/stream/${fileKey}`,
  ADMIN_GET: (id: string) => `/admin/api/v1/admin/${id}`,

  /*For admin Notifications */
  GET_ALL_NOTIFICATIONS: "/admin/api/v1/admin/notification/all",
  DELETE_NOTIFICATION: (id: string) => `/admin/api/v1/admin/notification/delete/${id}`,
  GET_PAGED_NOTIFICATIONS: "/admin/api/v1/admin/notification/paged",
};
