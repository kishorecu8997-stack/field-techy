/* For Engineer File Operations */
export const ENGINEER_FILE_ROUTER_PATHS = {
    UPLOAD: (engineerId: string, documentType: string) =>
        `/eng/api/v1/engineers/files/${engineerId}/${documentType}/upload`,
    GET_BY_ENGINEER_ID: (engineerId: string) =>
        `/eng/api/v1/engineers/files/${engineerId}`,
};
