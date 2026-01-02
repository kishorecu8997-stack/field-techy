export const CLIENT_USER_AUTH_ROUTER_PATHS = {
  LOGIN: "/user/api/v1/users/clt/signin",
  SIGNUP: "/client/api/v1/clients/signup",
  OTPREQUEST: (phoneOrEmail: string) =>
    `/user/api/v1/users/signin/req/otp/${phoneOrEmail}`,
  VERIFYOTPCLIENT: (otp: string) =>
    `/user/api/v1/users/clt/signin/by-otp/${otp}`,
};
