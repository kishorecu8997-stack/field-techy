/* For Engineer SignUp, SignIn, Retrieve, Delete */
export const ENGINEER_ROUTER_PATHS = {
    SIGNUP: "/eng/api/v1/engineers/signup",
    GET_BY_ID: (id: string) => `/eng/api/v1/engineers/${id}`,
    DELETE: (id: string) => `/eng/api/v1/engineers/delete/${id}`,
    GET_FILES: (id: string) => `/eng/api/v1/engineers/files/${id}`,
    DOWNLOAD_FILE: (fileKey: string) => `/eng/api/v1/engineers/files/download/stream/${fileKey}`,
    UPLOAD_FILE: (engineerId: string, documentType: string) =>
        `/eng/api/v1/engineers/files/${engineerId}/${documentType}/upload`,
} as const;