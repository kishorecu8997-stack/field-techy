/* For User Operations */
export const USER_ROUTER_PATHS = {
  /**
   * Check if user exists by email or phone
   * Endpoint: GET /api/v1/users/exists/<encoded_email_or_phone>
   * The <encoded_email_or_phone> is the slug parameter in the URL path.
   * The email or phone should be URL encoded before being passed to this endpoint.
   */
  EXISTS: (encodedEmailOrPhone: string) =>
    `/user/api/v1/users/exists/${encodedEmailOrPhone}`,
} as const;
