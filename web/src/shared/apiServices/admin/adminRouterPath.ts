/*For Admin SignUp, SignIn, Retrieve, Delete */
export const ADMIN_ROUTER_PATHS = {
  SIGNIN: "/user/api/v1/users/adm/signin",
  FORGOTPASSWORD_OTP_REQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/otp/request/${phoneOrEmail}`,
  RESET_PASSWORD_USING_OTP: (otp: string) =>
    `/user/api/v1/users/password/reset/by-otp/${otp}`,

  /*For admin Notifications */
  GET_ALL_NOTIFICATIONS: "/admin/api/v1/admin/notification/all",
  DELETE_NOTIFICATION: (id: string) => `/admin/api/v1/admin/notification/delete/${id}`,
  GET_PAGED_NOTIFICATIONS: "/admin/api/v1/admin/notification/paged",
};
