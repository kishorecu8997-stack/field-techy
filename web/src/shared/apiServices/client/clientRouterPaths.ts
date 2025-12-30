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
  SEND_EMAIL_OTP: (email: string) => `/user/api/v1/users/otp/request/${email}`,
  SEND_PHONE_OTP: (phone: string) => `/user/api/v1/users/otp/request/${phone}`,
  VERIFY_OTP: (emailOrPhone: string, otp: string) =>
    `/user/api/v1/users/otp/verify/${emailOrPhone}/${otp}`,

  // signin otp endpoints

  CLI_SIGNIN: (otp: string) => `/api/v1/users/clt/signin/by-otp/${otp}`,
  ADMIN_SIGNIN: (otp: string) => `/api/v1/users/adm/signin/by-otp/${otp}`,

  // Dropdown data endpoints
  GET_STATES: "/clients/dropdown/states",
  GET_CITIES: "/clients/dropdown/cities",
  GET_INDUSTRIES: "/clients/dropdown/industries",
  GET_VAT_OPTIONS: "/clients/dropdown/vat-options",
  GET_PHONE_COUNTRIES: "/clients/dropdown/phone-countries",

  // File upload endpoints
  UPLOAD_FILE: (clientId: string, documentType: string) =>
    `/client/api/v1/clients/files/${clientId}/${documentType}/upload`,
  GET_FILES: (clientId: string) => `/clients/${clientId}/files`,
  DELETE_FILE: (fileId: string) => `/clients/files/${fileId}`,
  DOWNLOAD_FILE: (fileId: string) => `/clients/files/${fileId}/download`,
} as const;
