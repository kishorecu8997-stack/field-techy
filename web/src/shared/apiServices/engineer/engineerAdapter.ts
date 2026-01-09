import axiosInstance, { uploadAxiosInstance } from "@/axiosInstance";
import { ENGINEER_ROUTER_PATHS } from "./engineerRouterPaths";
import type {
  AssignJobParams,
  EngineerData,
  EngineerFile,
  // EngineerPaginationParams,
  // PagedResponse,
  FileUploadParams,
  FileUploadResponse,
  JobAssignment,
  ScreenUploadParams,
  ScreenUploadResponse,
  UpdatePasswordParams,
} from "./engineerTypes";
import { GlobalApiErrorHandler } from "../utils";

/*
 * EngineerAdapter
 *
 * Responsible for making API calls to the engineer-related endpoints.
 * Provides methods for signing up, signing in, getting an engineer by ID,
 * getting all engineers, updating an engineer, and deleting an engineer.
 *
 * The adapter also includes a helper function for converting pagination
 * parameters into the expected format for the API.
 */
export class EngineerAdapter {
  static async signup(data: EngineerData): Promise<EngineerData> {
    try {
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.SIGNUP,
        data
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async getById(id: string): Promise<EngineerData> {
    try {
      const response = await axiosInstance.get(
        ENGINEER_ROUTER_PATHS.GET_BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(ENGINEER_ROUTER_PATHS.DELETE(id));
      return true;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async getFiles(engineerId: string): Promise<EngineerFile[]> {
    try {
      const response = await axiosInstance.get(
        ENGINEER_ROUTER_PATHS.GET_FILES(engineerId)
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async downloadFile(fileKey: string, fileName?: string): Promise<void> {
    try {
      const response = await axiosInstance.get(
        ENGINEER_ROUTER_PATHS.DOWNLOAD_FILE(fileKey),
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );

      // Create blob URL
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async uploadFile(
    params: FileUploadParams
  ): Promise<FileUploadResponse> {
    try {
      const { engineerId, file, documentType, onUploadProgress } = params;

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadAxiosInstance.post(
        ENGINEER_ROUTER_PATHS.UPLOAD_FILE(engineerId, documentType),
        formData,
        {
          headers: {
            "X-USER": "ENGINEER",
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
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async uploadScreenshot(
    params: ScreenUploadParams
  ): Promise<ScreenUploadResponse> {
    try {
      const { engineerId, file, documentType, metadata } = params;
      const formData = new FormData();
      formData.append("file", file || "");
      formData.append(
        "metadata",
        new Blob(
          [
            JSON.stringify({
              engineerJobId: metadata.engineerJobId,
              remarks: metadata.remarks,
            }),
          ],
          { type: "application/json" }
        )
      );

      const response = await uploadAxiosInstance.post(
        ENGINEER_ROUTER_PATHS.UPLOAD_SCREENSHOT(engineerId, documentType),
        formData,
        {
          headers: {
            "X-USER": "Engineer",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  static async assignJob(params: AssignJobParams): Promise<JobAssignment> {
    try {
      const { engineerId, jobId, status } = params;
      const response = await axiosInstance.post(
        `${ENGINEER_ROUTER_PATHS.ASSIGN_JOB(
          engineerId
        )}?jobId=${jobId}&status=${status}`
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async getJobs(engineerId: string): Promise<JobAssignment[]> {
    try {
      const response = await axiosInstance.get(
        ENGINEER_ROUTER_PATHS.GET_JOBS(engineerId)
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async updateJobStatus(
    jobId: string,
    status: string
  ): Promise<JobAssignment> {
    try {
      const response = await axiosInstance.put(
        `${ENGINEER_ROUTER_PATHS.UPDATE_JOB_STATUS(jobId)}?status=${status}`,
        {},
        {
          headers: {
            "X-USER": "ENGINEER",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  // OTP Methods (Stubbed for now)
  static async sendEmailOTP(email: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log("email :", email);
      const urlEncodedEmail = encodeURIComponent(email);
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.REQ_OTP(urlEncodedEmail)
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async updatePassword(params: UpdatePasswordParams): Promise<boolean> {
    try {
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.CHANGE_PASSWORD,
        {
          phoneOrEmail: params.phoneOrEmail,
          oldPassword: params.oldPassword,
          newPassword: params.newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  static async sendPhoneOTP(phoneNumber: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.REQ_OTP(phoneNumber)
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }

    // Stubbed response
    // console.log(`[STUB] Sending engineer phone OTP to: ${phoneNumber}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to phone" });
    //   }, 1000);
    // });
  }

  static async verifyEmailOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; verified: boolean }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.VERIFY_OTP(email, otp)
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }

    // Stubbed response - accepts any 4-digit OTP
    // console.log(
    //   `[STUB] Verifying engineer email OTP for: ${email}, OTP: ${otp}`
    // );
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (otp.length === 4) {
    //       resolve({
    //         message: "Email OTP verified successfully",
    //         verified: true,
    //       });
    //     } else {
    //       reject(new Error("Invalid OTP"));
    //     }
    //   }, 800);
    // });
  }

  static async verifyPhoneOTP(
    phoneNumber: string,
    otp: string
  ): Promise<{ message: string; verified: boolean }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        ENGINEER_ROUTER_PATHS.VERIFY_OTP(phoneNumber, otp)
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }
}
