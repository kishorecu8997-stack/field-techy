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

  static async signup(data: ClientData): Promise<ClientData> {
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SIGNUP, data);
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
    const response = await axiosInstance.put(CLIENT_ROUTER_PATHS.UPDATE(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE(id));
  }

  static async getFiles(clientId: string): Promise<ClientFile[]> {
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_FILES(clientId));
    return response.data;
  }

  static async uploadFile(params: ClientFileUploadParams): Promise<FileUploadResponse> {
    const { clientId, file, documentType, onUploadProgress } = params;

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadAxiosInstance.post(
      CLIENT_ROUTER_PATHS.UPLOAD_FILE(clientId, documentType),
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
