/* For Engineer SignUp, SignIn, Retrieve, Delete */
export const ENGINEER_ROUTER_PATHS = {
  SIGNUP: "/eng/api/v1/engineers/signup",
  SIGNIN: "/user/api/v1/users/signin",
  GET_BY_ID: (id: string) => `/eng/api/v1/engineers/${id}`,
  DELETE: (id: string) => `/eng/api/v1/engineers/delete/${id}`,
};
