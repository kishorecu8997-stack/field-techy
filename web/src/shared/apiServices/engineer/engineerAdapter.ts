import axiosInstance from "@/axiosInstance";
import { uploadAxiosInstance } from "@/axiosInstance";
import { ENGINEER_ROUTER_PATHS } from "./engineerRouterPaths";
import type {
  EngineerData,
  EngineerPaginationParams,
  PagedResponse,
  FileUploadParams,
  FileUploadResponse,
  EngineerFile,
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
    const response = await axiosInstance.post(ENGINEER_ROUTER_PATHS.SIGNUP, data);
    return response.data;
  }

  static async getById(id: string): Promise<EngineerData> {
    const response = await axiosInstance.get(ENGINEER_ROUTER_PATHS.GET_BY_ID(id));
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await axiosInstance.delete(ENGINEER_ROUTER_PATHS.DELETE(id));
  }

  static async getFiles(engineerId: string): Promise<EngineerFile[]> {
    const response = await axiosInstance.get(ENGINEER_ROUTER_PATHS.GET_FILES(engineerId));
    return response.data;
  }

  static async downloadFile(fileKey: string, fileName?: string): Promise<void> {
    const response = await axiosInstance.get(
      ENGINEER_ROUTER_PATHS.DOWNLOAD_FILE(fileKey),
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

  static async uploadFile(params: FileUploadParams): Promise<FileUploadResponse> {
    const { engineerId, file, documentType, onUploadProgress } = params;

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadAxiosInstance.post(
      ENGINEER_ROUTER_PATHS.UPLOAD_FILE(engineerId, documentType),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
}
