import axiosInstance from "@/axiosInstance";
import { USER_ROUTER_PATHS } from "./userRouterPaths";
import type { UserExistsResponse } from "./userTypes";
import axios from "axios";

/*
 * UserAdapter
 *
 * Responsible for making API calls to the user-related endpoints.
 */
export class UserAdapter {
  /**
   * Check if a user exists by email or phone number
   *
   * Endpoint: GET /api/v1/users/exists/<encoded_email_or_phone>
   * The <encoded_email_or_phone> is the slug parameter in the URL path.
   *
   * Returns 200 with "Available" if email/phone is available.
   * Returns 409 with "Already in use." if email/phone is already taken.
   *
   * @param emailOrPhone - The email address or phone number to check (will be URL encoded)
   * @param signal - Optional AbortSignal to cancel the request
   * @returns User exists response indicating availability (handles both 200 and 409 as valid responses)
   */
  static async exists(
    emailOrPhone: string,
    signal?: AbortSignal,
  ): Promise<UserExistsResponse> {
    // URL encode the email or phone number for the slug
    const encodedEmailOrPhone = encodeURIComponent(emailOrPhone);

    try {
      const response = await axiosInstance.get(
        USER_ROUTER_PATHS.EXISTS(encodedEmailOrPhone),
        {
          signal,
        },
      );
      return response.data;
    } catch (error) {
      // Handle 409 Conflict as a valid response (email/phone is already in use)
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Return the 409 response data as a valid response
        return error.response.data as UserExistsResponse;
      }
      // Re-throw other errors
      throw error;
    }
  }
}
