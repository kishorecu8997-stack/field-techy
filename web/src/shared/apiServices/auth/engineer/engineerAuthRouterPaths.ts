export const ENGINEER_USER_AUTH_ROUTER_PATHS = {
  LOGIN: "/user/api/v1/users/eng/signin",
  SIGNUP: "/engineer/api/v1/engineers/signup",
  OTPREQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/signin/req/otp/${phoneOrEmail}`,
  VERIFYOTPENGINEER: (otp: string) =>
    `/user/api/v1/users/eng/signin/by-otp/${otp}`,
};
