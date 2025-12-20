/* For Client SignUp, SignIn, Retrieve, Delete */
export const CLIENT_ROUTER_PATHS = {
  SIGNUP: "/client/api/v1/clients/signup",
  SIGNIN: "/user/api/v1/users/signin",
  GET_BY_ID: (id: string) => `/client/api/v1/clients/${id}`,
  GET_ALL: "/client/api/v1/clients",
  GET_PAGED: "/client/api/v1/clients/paged",
  UPDATE: (id: string) => `/client/api/v1/clients/update/${id}`,
  DELETE: (id: string) => `/client/api/v1/clients/delete/${id}`,
  CLIENT_REQUEST_EMAIL_VERIFICATION_OTP: "/client/api/v1/clients/request-email-verification-otp",
  GET_FILES: (id: string) => `/client/api/v1/clients/files/${id}`,
  UPLOAD_FILE: (clientId: string, documentType: string) =>
    `/client/api/v1/clients/files/${clientId}/${documentType}/upload`,
  DELETE_FILE: (fileId: string) => `/client/api/v1/clients/files/${fileId}`,
  DOWNLOAD_FILE: (fileKey: string) => `/client/api/v1/clients/files/download/stream/${fileKey}`,
};
