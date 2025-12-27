import axiosInstance from "@/axiosInstance";
import { uploadAxiosInstance } from "@/axiosInstance";
import { CLIENT_ROUTER_PATHS } from "./clientRouterPaths";
import type {
  ClientData,
  ClientPaginationParams,
  PagedResponse,
  ClientFile,
  ClientFileUploadParams,
  FileUploadResponse,
} from "./clientTypes";
import type { LoginFormData } from "@/pages/admin/auth/types";

/*
 * ClientAdapter
 *
 * Responsible for making API calls to the client-related endpoints.
 * Provides methods for signing up, signing in, getting a client by ID,
 * getting all clients, updating a client, and deleting a client.
 *
 * The adapter also includes a helper function for converting pagination
 * parameters into the expected format for the API.
 */
export class ClientAdapter {

  /**
   * Helper to handle API errors and return standardized messages
   */
  private static handleApiError(error: any): never {
    if (error.response) {
      console.log("error ===>", error)
      const status = error.response.status;
      if (status === 400) {
        throw new Error("Invalid request details. Please check your inputs.");
      }
      if (status === 500) {
        throw new Error("Internal server error. Please try again later.");
      }
    }
    // Re-throw original error if not handled above
    throw error;
  }

  static async signup(data: ClientData): Promise<ClientData> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SIGNUP, data);
      return response.data;
    } catch (error) {
      ClientAdapter.handleApiError(error);
    }

    // Stubbed for testing - returns fixed client ID to enable document upload flow
    // console.log('[STUB] Client signup called with data:', data);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       ...data,
    //       id: "3201d141-f502-4e6e-842a-45d11af3a30b", // Fixed ID for testing
    //       isApproved: true,
    //     });
    //   }, 1000);
    // });
  }

  static async signin(data: LoginFormData) {
    const payload = {
      phoneOrEmail: data.email,
      password: data.password,
    };
    const response = await axiosInstance.post(
      CLIENT_ROUTER_PATHS.SIGNIN,
      payload
    );
    return response.data;
  }

  static async getById(id: string): Promise<ClientData> {
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_BY_ID(id));
    return response.data;
  }

  static async getAllClients(): Promise<ClientData[]> {
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_ALL);
    return response.data;
  }

  static async getAll(params: ClientPaginationParams = {}): Promise<PagedResponse<ClientData>> {
    const { page = 0, size = 10, sortBy = "createdAt", direction = "DESC" } = params;
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_PAGED, {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

  static async update(id: string, data: ClientData): Promise<ClientData> {
    const response = await axiosInstance.put(
      CLIENT_ROUTER_PATHS.UPDATE(id),
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE(id));
  }

  // OTP Methods (Stubbed for now)
  static async sendEmailOTP(email: string): Promise<{ message: string }> {
    // TODO: Replace with actual API call when backend is ready
    const urlEncodedEmail = encodeURIComponent(email);
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SEND_EMAIL_OTP(urlEncodedEmail));
    return response.data;

    // // Stubbed response
    // console.log(`[STUB] Sending email OTP to: ${email}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to email" });
    //   }, 1000);
    // });
  }

  static async sendEmailMobileOtp(emailOrPhone: string): Promise<{ message: string }> {
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SEND_EMAIL_OTP(emailOrPhone));
    return response.data;
  }

  static async sendPhoneOTP(phoneNumber: string): Promise<{ message: string }> {
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SEND_PHONE_OTP(phoneNumber));
    return response.data;

    // Stubbed response
    // console.log(`[STUB] Sending phone OTP to: ${phoneNumber}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to phone" });
    //   }, 1000);
    // });
  }

  static async verifyOtp(
    emailOrPhone: string,
    otp: string
  ): Promise<{ message: string; verified: boolean }> {
    // TODO: Replace with actual API call when backend is ready
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.VERIFY_OTP(emailOrPhone, otp));
    return response.data;

    // Stubbed response - accepts any 4-digit OTP
    // console.log(`[STUB] Verifying email OTP for: ${email}, OTP: ${otp}`);
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (otp.length === 4) {
    //       resolve({ message: "Email OTP verified successfully", verified: true });
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
    // const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.VERIFY_PHONE_OTP, { phoneNumber, otp });
    // return response.data;

    // Stubbed response - accepts any 4-digit OTP
    console.log(`[STUB] Verifying phone OTP for: ${phoneNumber}, OTP: ${otp}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp.length === 4) {
          resolve({ message: "Phone OTP verified successfully", verified: true });
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 800);
    });
  }

  // ===== Dropdown Data Methods =====

  /**
   * Get list of states for a country
   */
  static async getStates(countryId?: string): Promise<{ value: string; label: string }[]> {
    console.log(`[STUB] Fetching states for country: ${countryId || 'all'}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const states = [
          { value: "Maharashtra", label: "Maharashtra" },
          { value: "Karnataka", label: "Karnataka" },
          { value: "Delhi", label: "Delhi" },
          { value: "Tamil Nadu", label: "Tamil Nadu" },
          { value: "Gujarat", label: "Gujarat" },
        ];
        resolve(states);
      }, 500);
    });
  }

  /**
   * Get list of cities for a state
   */
  static async getCities(stateId: string): Promise<{ value: string; label: string }[]> {
    console.log(`[STUB] Fetching cities for state: ${stateId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const cityMap: Record<string, { value: string; label: string }[]> = {
          "Maharashtra": [
            { value: "Mumbai", label: "Mumbai" },
            { value: "Pune", label: "Pune" },
            { value: "Nagpur", label: "Nagpur" },
          ],
          "Karnataka": [
            { value: "Bangalore", label: "Bangalore" },
            { value: "Mysore", label: "Mysore" },
          ],
          "Delhi": [
            { value: "New Delhi", label: "New Delhi" },
            { value: "Old Delhi", label: "Old Delhi" },
          ],
        };
        resolve(cityMap[stateId] || []);
      }, 500);
    });
  }

  /**
   * Get list of industries
   */
  static async getIndustries(): Promise<{ value: string; label: string }[]> {
    console.log('[STUB] Fetching industries');
    return new Promise((resolve) => {
      setTimeout(() => {
        const industries = [
          { value: "Information Technology`", label: "Information Technology" },
          { value: "Construction", label: "Construction" },
          { value: "Manufacturing", label: "Manufacturing" },
          { value: "Healthcare", label: "Healthcare" },
          { value: "Finance", label: "Finance" },
          { value: "Retail", label: "Retail" },
          { value: "Education", label: "Education" },
        ];
        resolve(industries);
      }, 500);
    });
  }

  /**
   * Get list of VAT options
   */
  static async getVatOptions(): Promise<{ value: string; label: string }[]> {
    console.log('[STUB] Fetching VAT options');
    return new Promise((resolve) => {
      setTimeout(() => {
        const vatOptions = [
          { value: "IE6388047V", label: "IE6388047V" },
          { value: "ID9488043M", label: "ID9488043M" },
          { value: "GB123456789", label: "GB123456789" },
          { value: "FR12345678901", label: "FR12345678901" },
        ];
        resolve(vatOptions);
      }, 500);
    });
  }

  static async getFiles(clientId: string): Promise<ClientFile[]> {
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_FILES(clientId));
    return response.data;
  }

  static async uploadFile(params: ClientFileUploadParams): Promise<FileUploadResponse> {
    const { clientId, file, documentType, onUploadProgress } = params;

    const formData = new FormData();
    formData.append('file', file);

    const path = CLIENT_ROUTER_PATHS.UPLOAD_FILE(clientId, documentType);
    console.log(`Uploading file to: ${path}`)
    const response = await uploadAxiosInstance.post(
      path,
      formData,
      {
        headers: {
          'X-USER': 'CLIENT',
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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

  static async deleteFile(fileId: string): Promise<void> {
    await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE_FILE(fileId));
  }

  static async downloadFile(fileKey: string, fileName?: string): Promise<void> {
    const response = await axiosInstance.get(
      CLIENT_ROUTER_PATHS.DOWNLOAD_FILE(fileKey),
      {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    // Create blob URL
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // Create temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
