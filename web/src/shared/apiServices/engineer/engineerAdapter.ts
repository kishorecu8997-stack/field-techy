import axiosInstance from "@/axiosInstance";
import { uploadAxiosInstance } from "@/axiosInstance";
import { ENGINEER_ROUTER_PATHS } from "./engineerRouterPaths";
import type {
  EngineerData,
  // EngineerPaginationParams,
  // PagedResponse,
  FileUploadParams,
  FileUploadResponse,
  EngineerFile,
  JobAssignment,
  AssignJobParams,
} from "./engineerTypes";

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
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.SIGNUP,
      data
    );
    return response.data;
  }

  static async getById(id: string): Promise<EngineerData> {
    const response = await axiosInstance.get(
      ENGINEER_ROUTER_PATHS.GET_BY_ID(id)
    );
    return response.data;
  }

  static async delete(id: string): Promise<boolean> {
    await axiosInstance.delete(ENGINEER_ROUTER_PATHS.DELETE(id));
    return true;
  }

  static async getFiles(engineerId: string): Promise<EngineerFile[]> {
    const response = await axiosInstance.get(
      ENGINEER_ROUTER_PATHS.GET_FILES(engineerId)
    );
    return response.data;
  }

  static async downloadFile(fileKey: string, fileName?: string): Promise<void> {
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
  }

  static async uploadFile(
    params: FileUploadParams
  ): Promise<FileUploadResponse> {
    const { engineerId, file, documentType, onUploadProgress } = params;

    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadAxiosInstance.post(
      ENGINEER_ROUTER_PATHS.UPLOAD_FILE(engineerId, documentType),
      formData,
      {
        headers: {
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
  }

  static async assignJob(params: AssignJobParams): Promise<JobAssignment> {
    const { engineerId, jobId, status } = params;
    const response = await axiosInstance.post(
      `${ENGINEER_ROUTER_PATHS.ASSIGN_JOB(
        engineerId
      )}?jobId=${jobId}&status=${status}`
    );
    return response.data;
  }

  static async getJobs(engineerId: string): Promise<JobAssignment[]> {
    const response = await axiosInstance.get(
      ENGINEER_ROUTER_PATHS.GET_JOBS(engineerId)
    );
    return response.data;
  }

  static async updateJobStatus(
    jobId: string,
    status: string
  ): Promise<JobAssignment> {
    const response = await axiosInstance.put(
      `${ENGINEER_ROUTER_PATHS.UPDATE_JOB_STATUS(jobId)}?status=${status}`
    );
    return response.data;
  }

  // OTP Methods (Stubbed for now)
  static async sendEmailOTP(email: string): Promise<{ message: string }> {
    // TODO: Replace with actual API call when backend is ready
    console.log('email :', email);
    const urlEncodedEmail = encodeURIComponent(email);
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.REQ_OTP(urlEncodedEmail)
    );
    return response.data;

    // Stubbed response
    // console.log(`[STUB] Sending engineer email OTP to: ${email}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to email" });
    //   }, 1000);
    // });
  }

  static async sendPhoneOTP(phoneNumber: string): Promise<{ message: string }> {
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.REQ_OTP(phoneNumber)
    );
    return response.data;

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
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.VERIFY_OTP(email, otp)
    );
    return response.data;

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
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.VERIFY_OTP(phoneNumber, otp)
    );
    return response.data;
  }
}
