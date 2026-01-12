/* For Engineer SignUp, SignIn, Retrieve, Delete */
export const ENGINEER_ROUTER_PATHS = {
  SIGNUP: "/eng/api/v1/engineers/signup",
  GET_BY_ID: (id: string) => `/eng/api/v1/engineers/${id}`,
  UPDATE_ENGINEER: (id: string) => `/eng/api/v1/engineers/update/${id}`,
  DELETE: (id: string) => `/eng/api/v1/engineers/delete/${id}`,

  // signin otp endpoints
  ENG_SIGNIN: (otp: string) => `/eng/api/v1/engineers/eng/signin/by-otp/${otp}`,
  REQ_OTP: (emailorPhone: string) =>
    `/user/api/v1/users/otp/request/${emailorPhone}`,
  DELETE_FILE: (fileId: string) =>
    `/eng/api/v1/engineers/files/${fileId}/delete`,

  // verify email and phone otp endpoints
  VERIFY_OTP: (emailorPhone: string, otp: string) =>
    `/user/api/v1/users/otp/verify/${emailorPhone}/${otp}`,
  GET_FILES: (id: string) => `/eng/api/v1/engineers/files/${id}`,
  DOWNLOAD_FILE: (fileKey: string) =>
    `/eng/api/v1/engineers/files/download/stream/${fileKey}`,
  UPLOAD_FILE: (engineerId: string, documentType: string) =>
    `/eng/api/v1/engineers/files/${engineerId}/${documentType}/upload`,
  // File upload endpoints
  GET_ENGINEER_FILES: (engineerId: string) =>
    `/eng/api/v1/engineers/files/${engineerId}`,
  DELETE_FILE: (fileId: string) => `/eng/api/v1/engineers/files/${fileId}`,
  DOWNLOAD_FILE_STREAM: (fileKey: string) =>
    `/eng/api/v1/engineers/files/download/stream/${fileKey}`,
  GET_JOBS: (engineerId: string) =>
    `/eng/api/v1/engineers/jobs/engineer/${engineerId}`,
  ASSIGN_JOB: (engineerId: string) =>
    `/eng/api/v1/engineers/jobs/${engineerId}/assign`,
  UPDATE_JOB_STATUS: (jobId: string) =>
    `/eng/api/v1/engineers/jobs/${jobId}/status`,

  // proposal endpoints
  SEND_PROPOSAL_JOB: () => `/eng/api/v1/engineers/proposals/save`,
  GET_PROPOSAL_JOBS_BY_ID: (id: string) =>
    `/eng/api/v1/engineers/proposals/${id}`,
  GET_PROPOSAL_ALL: () => `/eng/api/v1/engineers/proposals/all`,
  GET_ENGINEER_PROPOSALS: (engineerId: string) =>
    `/eng/api/v1/engineers/proposals/ALL/${engineerId}`,
  UPDATE_PROPOSAL_BY_ID: (id: string) =>
    `/eng/api/v1/engineers/proposals/update/${id}`,
  DELETE_PROPOSAL_BY_ID: (id: string) =>
    `/eng/api/v1/engineers/proposals/delete/${id}`,

  // Jobs endpoints
  GET_JOBS_BY_ID: (id: string) => `/eng/api/v1/engineers/jobs/${id}`,
  GET_JOBS_BY_ENGINEER_ID: (engineerId: string) =>
    `/eng/api/v1/engineers/jobs/engineer/${engineerId}`,
  RESET_PASSWORD: (otp: string) =>
    `/user/api/v1/users/password/reset/by-otp/${otp}`,
  CHANGE_PASSWORD: `/user/api/v1/users/password/change`,
} as const;
