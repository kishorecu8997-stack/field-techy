/* For Client SignUp, SignIn, Retrieve, Delete */
export const CLIENT_ROUTER_PATHS = {
  SIGNUP: "/client/api/v1/clients/signup",
  SIGNIN: "/user/api/v1/users/signin",
  GET_BY_ID: (id: string) => `/client/api/v1/clients/${id}`,
  GET_PAGED: "/client/api/v1/clients/paged",
  UPDATE: (id: string) => `/client/api/v1/clients/update/${id}`,
  DELETE: (id: string) => `/client/api/v1/clients/delete/${id}`,
  CLIENT_REQUEST_EMAIL_VERIFICATION_OTP: "/client/api/v1/clients/request-email-verification-otp",
};
