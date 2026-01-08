/*For Admin SignUp, SignIn, Retrieve, Delete */
export const ADMIN_ROUTER_PATHS = {
  SIGNIN: "/user/api/v1/users/adm/signin",
  FORGOTPASSWORD_OTP_REQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/otp/request/${phoneOrEmail}`,
  RESET_PASSWORD_USING_OTP: (otp: string) =>
    `/user/api/v1/users/password/reset/by-otp/${otp}`,
    CREATE_NOTIFICATION: "/admin/api/v1/admin/notification/create",
    GET_NOTIFICATION_BY_ID: (id: string) => `/admin/api/v1/admin/notification/${id}`,
    EDIT_NOTIFICATION: (id: string) => `/admin/api/v1/admin/notification/edit/${id}`,
} as const;
