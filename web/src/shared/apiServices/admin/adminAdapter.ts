import axiosInstance from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import type {
    AdminNotification,
    PagedNotificationsParams,
    PagedNotificationsResponse
} from './adminTypes';
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
    // Delete Notification
  static async DeleteNotification(id: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete(
        ADMIN_ROUTER_PATHS.DELETE_NOTIFICATION(id)
      );
      return response.data;
    } catch (error: unknown) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

    // Get All Notifications
    static async GetAllNotifications(): Promise<AdminNotification[]> {
        const response = await axiosInstance.get(
            ADMIN_ROUTER_PATHS.GET_ALL_NOTIFICATIONS
        );
        return response.data;
    }

    // Get Paged Notifications
  static async GetPagedNotifications(
    params: PagedNotificationsParams
  ): Promise<PagedNotificationsResponse> {
    const { page, size, sortBy = "createdAt", direction = "DESC" } = params;
    const response = await axiosInstance.get(ADMIN_ROUTER_PATHS.GET_PAGED_NOTIFICATIONS, {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

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
          undefined,
          response.config,
          response.data,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed",
          undefined,
          response.config,
          response.data,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
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
        ADMIN_ROUTER_PATHS.RESET_PASSWORD_USING_OTP(otp),
        restData
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}

