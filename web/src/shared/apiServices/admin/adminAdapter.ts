import axiosInstance from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import { AxiosError } from "axios";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "../utils";

/*
 * AdminAdapter
 *
 * Responsible for making API calls to the admin-related endpoints.
 * Provides methods for signing up, signing in, getting a admin by ID,
 * getting all admins, updating a admin, and deleting a admin.
 *
 * The adapter also includes a helper function for converting pagination
 * parameters into the expected format for the API.
 */
export class AdminAdapter {
  /**
   * Authenticates an admin user.
   *
   * @param data - Login credentials
   * @param data.email - Email address or phone number
   * @param data.password - User's password
   * @returns Promise resolving to authentication response data
   * @throws {Error} If authentication fails or request encounters an error
   */
  static async signIn(args: { phoneOrEmail: string; password: string }) {
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.SIGNIN,
        args
      );

      const authorization = response.headers["authorization"];
      const userId = response.headers["x-user"];
      const role = response.headers["x-user-type"];

      if (!authorization || !userId || !role) {
        console.error(
          "Authentication failed, missing headers:",
          response.headers
        );
        throw new AxiosError(
          "Authentication failed",
          "401",
          response.config,
          response.data,
          response
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed, invalid role",
          "401",
          response.config,
          response.data,
          response
        );
      }

      const authResponsePayload: UserSession = {
        accessToken: authorization,
        userId: userId,
        role: role as UserRole,
        initiatedAt: Date.now(),
      };

      return authResponsePayload;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Forgot Password OTP Request */
  static async forgotPasswordOtpRequest(phoneOrEmail: string) {
    try {
      const encodedPhoneOrEmail = encodeURIComponent(phoneOrEmail);
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.FORGOTPASSWORD_OTP_REQUEST(encodedPhoneOrEmail)
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Reset Password Using OTP */
  static async resetPasswordByOtp(data: {
    otp: string;
    phoneOrEmail: string;
    password: string;
  }) {
    const { otp, ...restData } = data;
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.REST_PASSWORD_USING_OTP(otp),
        restData
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
