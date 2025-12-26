/* For Client Profile Operations */
export const CLIENT_PROFILE_ROUTER_PATHS = {
    SIGNUP: "/client/api/v1/clients/signup",
    GET_BY_ID: (id: string) => `/client/api/v1/clients/${id}`,
    GET_PAGED: "/client/api/v1/clients/paged",
    UPDATE: (id: string) => `/client/api/v1/clients/update/${id}`,
    DELETE: (id: string) => `/client/api/v1/clients/delete/${id}`,
};
