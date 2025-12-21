/* For Client SignUp, SignIn, Retrieve, Delete */
export const CLIENT_ROUTER_PATHS = {
  SIGNUP: "/client/api/v1/clients/signup",
  SIGNIN: "/user/api/v1/users/signin",
  GET_BY_ID: (id: string) => `/client/api/v1/clients/${id}`,
  GET_ALL: "/client/api/v1/clients",
  GET_PAGED: "/client/api/v1/clients/paged",
  UPDATE: (id: string) => `/client/api/v1/clients/update/${id}`,
  DELETE: (id: string) => `/client/api/v1/clients/delete/${id}`,

  // OTP endpoints
  SEND_EMAIL_OTP: "/client/api/v1/clients/otp/send-email",
  SEND_PHONE_OTP: "/client/api/v1/clients/otp/send-phone",
  VERIFY_EMAIL_OTP: "/clients/verify-email-otp",
  VERIFY_PHONE_OTP: "/clients/verify-phone-otp",

  // Dropdown data endpoints
  GET_STATES: "/clients/dropdown/states",
  GET_CITIES: "/clients/dropdown/cities",
  GET_INDUSTRIES: "/clients/dropdown/industries",
  GET_VAT_OPTIONS: "/clients/dropdown/vat-options",

  // File upload endpoints
  UPLOAD_FILE: (clientId: string) => `/clients/${clientId}/files/upload`,
  GET_FILES: (clientId: string) => `/clients/${clientId}/files`,
  DELETE_FILE: (fileId: string) => `/clients/files/${fileId}`,
  DOWNLOAD_FILE: (fileId: string) => `/clients/files/${fileId}/download`,
};
