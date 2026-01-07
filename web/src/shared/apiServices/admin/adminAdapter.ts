import axiosInstance, { uploadAxiosInstance } from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import { AxiosError } from "axios";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "../utils";
import type { FileUploadParams } from "../engineer/engineerTypes";
import type { FileUploadResponse } from "../client/clientTypes";

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

  /** Update Admin Profile */
  static async updateAdminProfile(data: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string;
    password: string;
    phoneNumber: string;
  }) {
    try {
      const response = await axiosInstance.put(
        ADMIN_ROUTER_PATHS.ADMIN_PROFILE_UPDATE(data.id),
        data
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Upload Admin File */
  static async uploadFile(params: any): Promise<FileUploadResponse> {
    try {
      const { adminId, file, fileType, onUploadProgress } = params;

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadAxiosInstance.post(
        ADMIN_ROUTER_PATHS.ADMIN_FILE_UPLOAD(adminId, fileType),
        formData,
        {
          headers: {
            "X-USER": "ADMIN",
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress && progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress({
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage,
              });
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
