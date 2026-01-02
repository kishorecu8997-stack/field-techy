/**
 * User Exists API Response
 * 
 * Response type for GET /api/v1/users/exists/<encoded_email_or_phone>
 * The <encoded_email_or_phone> is the slug parameter in the URL path.
 * 
 * 200 Response format (Available):
 * {
 *     "type": "about:blank",
 *     "title": "OK",
 *     "status": 200,
 *     "detail": "Available",
 *     "instance": "/api/v1/users/exists/<urlencoded_number>"
 * }
 * 
 * 409 Response format (Already in use):
 * {
 *     "type": "about:blank",
 *     "title": "Conflict",
 *     "status": 409,
 *     "detail": "Already in use.",
 *     "instance": "/api/v1/users/exists/<urlencoded_number>"
 * }
 */
export interface UserExistsResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
}

