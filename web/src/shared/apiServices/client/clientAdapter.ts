import axiosInstance, { uploadAxiosInstance } from "@/axiosInstance";
import type { LoginFormData } from "@/pages/admin/auth/types";
import type { JobItem } from "@/pages/engineer/home/types";
import type { Country } from "@/shared/components/commonUI/inputs/type";
import { GlobalApiErrorHandler } from "../utils";
import { CLIENT_ROUTER_PATHS } from "./clientRouterPaths";
import type {
  ClientData,
  ClientFile,
  ClientFileUploadParams,
  ClientPaginationParams,
  FileDownloadResponse,
  FileUploadResponse,
  PagedResponse,
} from "./clientTypes";

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
   * Registers a new client.
   *
   * @param data - Client registration data including personal and company information
   * @returns Promise resolving to the created client data with assigned ID
   * @throws {Error} If registration fails or request encounters an error
   */
  static async signup(data: ClientData): Promise<ClientData> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SIGNUP,
        data,
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
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

  /**
   * Authenticates a client user.
   *
   * @param data - Login credentials
   * @param data.email - Email address or phone number
   * @param data.password - User's password
   * @returns Promise resolving to authentication response data
   * @throws {Error} If authentication fails or request encounters an error
   */
  static async signin(data: LoginFormData) {
    try {
      const payload = {
        phoneOrEmail: data.email,
        password: data.password,
      };
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SIGNIN,
        payload,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Retrieves a client by their unique identifier.
   *
   * @param id - Unique identifier of the client
   * @returns Promise resolving to client data
   * @throws {Error} If the client is not found or request encounters an error
   */
  static async getById(id: string): Promise<ClientData> {
    try {
      const response = await axiosInstance.get(
        CLIENT_ROUTER_PATHS.GET_BY_ID(id),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Retrieves all clients (non-paginated).
   *
   * @returns Promise resolving to an array of all client data
   * @throws {Error} If the request encounters an error
   * @remarks For large datasets, consider using the paginated `getAll` method instead.
   */
  static async getAllClients(): Promise<ClientData[]> {
    try {
      const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_ALL);
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Retrieves a paginated list of clients.
   *
   * @param params - Pagination and sorting parameters
   * @param params.page - Page number (default: 0)
   * @param params.size - Number of items per page (default: 10)
   * @param params.sortBy - Field to sort by (default: "createdAt")
   * @param params.direction - Sort direction: "ASC" or "DESC" (default: "DESC")
   * @returns Promise resolving to paginated client data
   * @throws {Error} If the request encounters an error
   */
  static async getAll(
    params: ClientPaginationParams = {},
  ): Promise<PagedResponse<ClientData>> {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = "createdAt",
        direction = "DESC",
      } = params;
      const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_PAGED, {
        params: { page, size, sortBy, direction },
      });
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Updates an existing client.
   *
   * @param id - Unique identifier of the client to update
   * @param data - Updated client data
   * @returns Promise resolving to the updated client data
   * @throws {Error} If the update fails or request encounters an error
   */
  static async update(id: string, data: ClientData): Promise<ClientData> {
    try {
      const response = await axiosInstance.put(
        CLIENT_ROUTER_PATHS.UPDATE(id),
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Deletes a client by ID.
   *
   * @param id - Unique identifier of the client to delete
   * @returns Promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails or request encounters an error
   */
  static async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE(id));
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  // ===== OTP Methods =====

  /**
   * Sends an OTP (One-Time Password) to the specified email address.
   *
   * @param email - Email address to send OTP to (will be URL encoded)
   * @returns Promise resolving to a message confirming OTP was sent
   * @throws {Error} If OTP sending fails or request encounters an error
   */
  static async sendEmailOTP(email: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const urlEncodedEmail = encodeURIComponent(email);
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SEND_EMAIL_OTP(urlEncodedEmail),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }

    // // Stubbed response
    // console.log(`[STUB] Sending email OTP to: ${email}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to email" });
    //   }, 1000);
    // });
  }

  /**
   * Sends an OTP to either an email address or phone number.
   *
   * @param emailOrPhone - Email address or phone number to send OTP to
   * @returns Promise resolving to a message confirming OTP was sent
   * @throws {Error} If OTP sending fails or request encounters an error
   */
  static async sendEmailMobileOtp(
    emailOrPhone: string,
  ): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SEND_EMAIL_OTP(emailOrPhone),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Sends an OTP to the specified phone number.
   *
   * @param phoneNumber - Phone number to send OTP to
   * @returns Promise resolving to a message confirming OTP was sent
   * @throws {Error} If OTP sending fails or request encounters an error
   */
  static async sendPhoneOTP(phoneNumber: string): Promise<{ message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.SEND_PHONE_OTP(phoneNumber),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }

    // Stubbed response
    // console.log(`[STUB] Sending phone OTP to: ${phoneNumber}`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({ message: "OTP sent successfully to phone" });
    //   }, 1000);
    // });
  }

  /**
   * Verifies an OTP code for email or phone verification.
   *
   * @param emailOrPhone - Email address or phone number that received the OTP
   * @param otp - One-time password code to verify
   * @returns Promise resolving to verification result with message and verified status
   * @throws {Error} If OTP verification fails or request encounters an error
   */
  static async verifyOtp(
    emailOrPhone: string,
    otp: string,
  ): Promise<{ message: string; verified: boolean }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      const response = await axiosInstance.post(
        CLIENT_ROUTER_PATHS.VERIFY_OTP(emailOrPhone, otp),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }

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
    otp: string,
  ): Promise<{ message: string; verified: boolean }> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.VERIFY_PHONE_OTP, { phoneNumber, otp });
    // return response.data;

    // Stubbed response - accepts any 4-digit OTP
    console.log(`[STUB] Verifying phone OTP for: ${phoneNumber}, OTP: ${otp}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp.length === 4) {
          resolve({
            message: "Phone OTP verified successfully",
            verified: true,
          });
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
static async getStates(countryId?: string) {
  const id = (countryId || "").toString().toLowerCase();
  return new Promise<{ value: string; label: string }[]>((resolve) => {
    setTimeout(() => {
      let states: { value: string; label: string }[] = [];
console.log("getStates called with countryId:", countryId);

      if (id === "uk") {
        states = [
          { value: "England", label: "England" },
          { value: "Scotland", label: "Scotland" },
          { value: "Wales", label: "Wales" },
          { value: "Northern Ireland", label: "Northern Ireland" },
        ];
      } else if (id === "in") {
        states = [
          { value: "Maharashtra", label: "Maharashtra" },
          { value: "Karnataka", label: "Karnataka" },
          { value: "Delhi", label: "Delhi" },
          { value: "Tamil Nadu", label: "Tamil Nadu" },
          { value: "Gujarat", label: "Gujarat" },
        ];
      }
      resolve(states);
    }, 500);
  });
}

  /**
   * Get list of cities for a state
   */
  static async getCities(
  stateId: string,
): Promise<{ value: string; label: string }[]> {
  console.log(`[STUB] Fetching cities for state: ${stateId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const cityMap: Record<string, { value: string; label: string }[]> = {
        Maharashtra: [
          { value: "Mumbai", label: "Mumbai" },
          { value: "Pune", label: "Pune" },
          { value: "Nagpur", label: "Nagpur" },
        ],
        Karnataka: [
          { value: "Bangalore", label: "Bangalore" },
          { value: "Mysore", label: "Mysore" },
        ],
        Delhi: [
          { value: "New Delhi", label: "New Delhi" },
          { value: "Old Delhi", label: "Old Delhi" },
        ],
        "Tamil Nadu": [
          { value: "Chennai", label: "Chennai" },
          { value: "Coimbatore", label: "Coimbatore" },
        ],
        Gujarat: [
          { value: "Ahmedabad", label: "Ahmedabad" },
          { value: "Surat", label: "Surat" },
        ],

        England: [
          { value: "London", label: "London" },
          { value: "Manchester", label: "Manchester" },
          { value: "Liverpool", label: "Liverpool" },
        ],
        Scotland: [
          { value: "Edinburgh", label: "Edinburgh" },
          { value: "Glasgow", label: "Glasgow" },
        ],
        Wales: [
          { value: "Cardiff", label: "Cardiff" },
          { value: "Swansea", label: "Swansea" },
        ],
        "Northern Ireland": [
          { value: "Belfast", label: "Belfast" },
          { value: "Londonderry", label: "Londonderry" },
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
    console.log("[STUB] Fetching industries");
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
    console.log("[STUB] Fetching VAT options");
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

  /**
   * Get list of phone countries
   * TODO: Replace with actual API call when backend is ready
   */
  static async getPhoneCountries(): Promise<Country[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_PHONE_COUNTRIES);
      // return response.data;

      // Stubbed response for now
      console.log("[STUB] Fetching phone countries");
      return new Promise((resolve) => {
        setTimeout(() => {
          const phoneCountries: Country[] = [
            {
              code: "+91",
              name: "India",
              flag: "https://flagcdn.com/w40/in.png",
              validationKey: "india",
            },
            {
              code: "+44",
              name: "UK",
              flag: "https://flagcdn.com/w40/gb.png",
              validationKey: "uk",
            },
          ];
          resolve(phoneCountries);
        }, 500);
      });
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  // ===== File Management Methods =====

  /**
   * Retrieves all files associated with a client.
   *
   * @param clientId - Unique identifier of the client
   * @returns Promise resolving to an array of client file data
   * @throws {Error} If the request encounters an error
   */
  static async getFiles(clientId: string): Promise<ClientFile[]> {
    try {
      const response = await axiosInstance.get(
        CLIENT_ROUTER_PATHS.GET_CLIENT_FILES(clientId),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Uploads a file for a client.
   *
   * @param params - File upload parameters
   * @param params.clientId - Unique identifier of the client
   * @param params.file - File to upload
   * @param params.documentType - Type of document being uploaded
   * @param params.onUploadProgress - Optional callback to track upload progress
   * @returns Promise resolving to file upload response with file details
   * @throws {Error} If the upload fails or request encounters an error
   */
  static async uploadFile(
    params: ClientFileUploadParams,
  ): Promise<FileUploadResponse> {
    try {
      const { clientId, file, documentType, onUploadProgress } = params;

      const formData = new FormData();
      formData.append("file", file);

      const path = CLIENT_ROUTER_PATHS.UPLOAD_FILE(clientId, documentType);
      console.log(`Uploading file to: ${path}`);
      const response = await uploadAxiosInstance.post(path, formData, {
        headers: {
          "X-USER": "CLIENT",
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
      });
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Deletes a file by its unique identifier.
   *
   * @param fileId - Unique identifier of the file to delete
   * @returns Promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails or request encounters an error
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE_FILE(fileId));
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Downloads a file by its file key.
   *
   * @param fileKey - Unique file key identifier
   * @param fileName - Optional file name for the download (defaults to file key if not provided)
   * @returns Promise that resolves when the file download is complete
   * @throws {Error} If the download fails or request encounters an error
   */
  static async downloadFile(fileKey: string, fileName?: string): Promise<void> {
    try {
      const response = await axiosInstance.get(
        CLIENT_ROUTER_PATHS.DOWNLOAD_FILE(fileKey),
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
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

  /**
   * Download file stream with metadata
   * Returns blob with associated metadata (fileName, mimeType, size, etc.)
   */
  static async downloadFileStream(
    fileKey: string,
  ): Promise<FileDownloadResponse> {
    try {
      const response = await axiosInstance.get(
        CLIENT_ROUTER_PATHS.DOWNLOAD_FILE_STREAM(fileKey),
        {
          responseType: "blob",
          headers: {
            accept: "*/*",
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

  // jobs endpoints
  static async getJobs(): Promise<JobItem[]> {
    try {
      const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_JOBS);
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  // -------------------------- Jobs Endpoints -------------------------------
  static async getJobsById(id: string): Promise<JobItem> {
    try {
      const response = await axiosInstance.get(
        CLIENT_ROUTER_PATHS.GET_JOB_BY_ID(id),
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
