import axiosInstance, { uploadAxiosInstance } from "@/axiosInstance";
import { ADMIN_ROUTER_PATHS } from "./adminRouterPath";
import { AxiosError } from "axios";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "../utils";
import type {
  AdminNotification,
  CreateNotificationParams,
  UpdateNotificationParams,
  PagedNotificationsParams,
  PagedNotificationsResponse,
  UploadFile,
} from "./adminTypes";
import type {
  FileDownloadResponse,
  FileUploadResponse,
} from "../client/clientTypes";
import type { RateCardsResponse, RateCardParams, CreateRateCardParams, CreateRateCardResponse, UpdateRateCardParams, UpdateRateCardResponse, DeleteRateCardResponse } from "./adminTypes";

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
  /** Delete Notification */
  static async DeleteNotification(id: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete(
        ADMIN_ROUTER_PATHS.DELETE_NOTIFICATION(id),
      );
      return response.data;
    } catch (error: unknown) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Get All Notifications */
  static async GetAllNotifications(): Promise<AdminNotification[]> {
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.GET_ALL_NOTIFICATIONS,
      );
      return response.data;
    } catch (error: unknown) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Get Paged Notifications */
  static async GetPagedNotifications(
    params: PagedNotificationsParams,
  ): Promise<PagedNotificationsResponse> {
    const { page, size, sortBy = "createdAt", direction = "DESC" } = params;
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.GET_PAGED_NOTIFICATIONS,
        { params: { page, size, sortBy, direction } },
      );
      return response.data;
    } catch (error: unknown) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  // ------------------ Authentication ------------------

  /** Sign In */
  static async signIn(args: {
    phoneOrEmail: string;
    password: string;
  }): Promise<UserSession> {
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.SIGNIN,
        args,
      );

      const authorization = response.headers["authorization"];
      const userId = response.headers["x-user"];
      const role = response.headers["x-user-type"];

      if (!authorization || !userId || !role) {
        console.error(
          "Authentication failed, missing headers:",
          response.headers,
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
          },
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
          },
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
        ADMIN_ROUTER_PATHS.FORGOTPASSWORD_OTP_REQUEST(encodedPhoneOrEmail),
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
        restData,
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  // Create Notification
  static async createNotification(
    data: CreateNotificationParams,
  ): Promise<AdminNotification> {
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.CREATE_NOTIFICATION,
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
  /** Update Admin Profile */
  static async updateAdminProfile(data: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string;
    phoneNumber: string;
  }) {
    try {
      const response = await axiosInstance.put(
        ADMIN_ROUTER_PATHS.ADMIN_PROFILE_UPDATE(data.id),
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
  //Edit Notification
  static async editNotification(
    data: UpdateNotificationParams,
  ): Promise<AdminNotification> {
    try {
      const response = await axiosInstance.put(
        ADMIN_ROUTER_PATHS.EDIT_NOTIFICATION(data.id),
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Upload Admin File */
  static async uploadFile(params: UploadFile): Promise<FileUploadResponse> {
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
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              onUploadProgress({
                loaded: progressEvent.loaded,
                total: progressEvent.total,
                percentage,
              });
            }
          },
        },
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Change Admin Password */
  static async changePassword(data: {
    phoneOrEmail: string;
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.ADMIN_CHANGE_PASSWORD,
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  // Get Notification By ID
  static async getNotificationById(id: string): Promise<AdminNotification> {
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.GET_NOTIFICATION_BY_ID(id),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Download Admin File Stream */
  static async downloadFileStream(
    fileKey: string,
  ): Promise<FileDownloadResponse> {
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.DOWNLOAD_FILE_STREAM(fileKey),
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
      );

      // Extract metadata from response headers
      const contentDisposition = response.headers["content-disposition"];
      const contentLength = response.headers["content-length"]
        ? parseInt(response.headers["content-length"], 10)
        : undefined;
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      // Extract filename from Content-Disposition header if available
      let fileName = "download";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
          // Handle URL-encoded filenames
          try {
            fileName = decodeURIComponent(fileName);
          } catch (e) {
            console.error("Failed to decode file name:", e);
            // If decoding fails, use the original filename
            throw new Error(
              "Failed to decode file name. Please try again later.",
            );
          }
        }
      }

      const blob = new Blob([response.data], { type: contentType });

      return {
        blob,
        fileName,
        mimeType: contentType,
        size: blob.size,
        contentDisposition,
        contentLength,
      };
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Get Admin by ID */
  static async getAdminById(id: string) {
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.ADMIN_GET(id),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Get Rate Cards */
  static async getRateCards(
    params?: RateCardParams,
  ): Promise<RateCardsResponse> {
    try {
      const response = await axiosInstance.get(
        ADMIN_ROUTER_PATHS.GET_RATE_CARDS,
        { params },
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Create Rate Card */
  static async createRateCard(
    data: CreateRateCardParams,
  ): Promise<CreateRateCardResponse> {
    try {
      const response = await axiosInstance.post(
        ADMIN_ROUTER_PATHS.CREATE_RATE_CARD,
        data,
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Update Rate Card */
  static async updateRateCard(
    id: number,
    data: UpdateRateCardParams,
  ): Promise<UpdateRateCardResponse> {
    try {
      const response = await axiosInstance.put(
        ADMIN_ROUTER_PATHS.UPDATE_RATE_CARD(id),
        data,
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /** Delete Rate Card */
  static async deleteRateCard(
    id: number,
  ): Promise<DeleteRateCardResponse> {
    try {
      const response = await axiosInstance.delete(
        ADMIN_ROUTER_PATHS.DELETE_RATE_CARD(id),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
