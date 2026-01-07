import axiosInstance from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import { AxiosError } from "axios";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "../utils";
import type {
    AdminNotification,
    CreateNotificationParams,
    UpdateNotificationParams
} from './adminTypes';

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

        // Create Notification
    static async CreateNotification(data: CreateNotificationParams): Promise<AdminNotification> {
        const response = await axiosInstance.post(
            ADMIN_ROUTER_PATHS.CREATE_NOTIFICATION,
            data
        );
        return response.data;
    }

        //Edit Notification
    static async EditNotification(
    data: UpdateNotificationParams
    ): Promise<AdminNotification> {
    const response = await axiosInstance.put(
        ADMIN_ROUTER_PATHS.EDIT_NOTIFICATION(data.id),
        data
    );
    return response.data;
    }
    
    // Get Notification By ID
    static async GetNotificationById(id: string): Promise<AdminNotification> {
  const response = await axiosInstance.get(
    ADMIN_ROUTER_PATHS.GET_NOTIFICATION_BY_ID(id)
  );
  return response.data;
}

} 

