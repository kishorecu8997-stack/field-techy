/* For Client Profile Operations */
export const CLIENT_PROFILE_ROUTER_PATHS = {
    SIGNUP: "/client/api/v1/clients/signup",
    GET_BY_ID: (id: string) => `/client/api/v1/clients/${id}`,
    /**
     * Get client profile by ID
     * Endpoint: GET /api/v1/clients/<clientId>
     * The <clientId> is the slug parameter in the URL path.
     */
    GET_PROFILE_BY_ID: (clientId: string) => `/api/v1/clients/${clientId}`,
    GET_PAGED: "/client/api/v1/clients/paged",
    UPDATE: (id: string) => `/client/api/v1/clients/update/${id}`,
    DELETE: (id: string) => `/client/api/v1/clients/delete/${id}`,
};
