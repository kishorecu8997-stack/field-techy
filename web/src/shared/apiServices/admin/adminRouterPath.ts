/*For Admin SignUp, SignIn, Retrieve, Delete */
export const ADMIN_ROUTER_PATHS = {
  SIGNIN: "/user/api/v1/users/adm/signin",
  FORGOTPASSWORD_OTP_REQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/otp/request/${phoneOrEmail}`,
  REST_PASSWORD_USING_OTP: (otp: string) =>
    `/user/api/v1/users/password/reset/by-otp/${otp}`,
};
