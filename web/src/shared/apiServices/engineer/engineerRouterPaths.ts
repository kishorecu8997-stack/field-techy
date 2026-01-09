/* For Engineer SignUp, SignIn, Retrieve, Delete */
export const ENGINEER_ROUTER_PATHS = {
  SIGNUP: "/eng/api/v1/engineers/signup",
  GET_BY_ID: (id: string) => `/eng/api/v1/engineers/${id}`,
  DELETE: (id: string) => `/eng/api/v1/engineers/delete/${id}`,

  // signin otp endpoints
  ENG_SIGNIN: (otp: string) => `/eng/api/v1/engineers/eng/signin/by-otp/${otp}`,
  REQ_OTP: (emailorPhone: string) =>
    `/user/api/v1/users/otp/request/${emailorPhone}`,

  // verify email and phone otp endpoints
  VERIFY_OTP: (emailorPhone: string, otp: string) =>
    `/user/api/v1/users/otp/verify/${emailorPhone}/${otp}`,
  GET_FILES: (id: string) => `/eng/api/v1/engineers/files/${id}`,
  DOWNLOAD_FILE: (fileKey: string) =>
    `/eng/api/v1/engineers/files/download/stream/${fileKey}`,
  UPLOAD_FILE: (engineerId: string, documentType: string) =>
    `/eng/api/v1/engineers/files/${engineerId}/${documentType}/upload`,
  UPLOAD_SCREENSHOT: (engineerId: string, documentType: string) =>
    `/eng/api/v1/engineers/jobs/history/${engineerId}/${documentType}/update`,
  GET_JOBS: (engineerId: string) =>
    `/eng/api/v1/engineers/jobs/engineer/${engineerId}`,
  ASSIGN_JOB: (engineerId: string) =>
    `/eng/api/v1/engineers/jobs/${engineerId}/assign`,
  UPDATE_JOB_STATUS: (jobId: string) =>
    `/eng/api/v1/engineers/jobs/${jobId}/status`,
} as const;
