import axiosInstance, { uploadAxiosInstance } from "@/axiosInstance";
import { ENGINEER_FILE_ROUTER_PATHS } from "./engineerFileRouterPaths";

export type EngineerFileDocumentType =
    | "RESUME"
    | "GOVERNMENT_ID"
    | "PICTURE"
    | "CERTIFICATE";

export interface EngineerFile {
    id: string;
    fileName: string;
    fileType: string;
    url: string;
    documentType: EngineerFileDocumentType;
    uploadedAt: string;
}

/*
 * EngineerFileAdapter
 *
 * Responsible for making API calls to the engineer file endpoints.
 * Uses uploadAxiosInstance for file uploads.
 */
export class EngineerFileAdapter {
    static async upload(
        engineerId: string,
        documentType: EngineerFileDocumentType,
        file: File
    ): Promise<EngineerFile> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadAxiosInstance.post(
            ENGINEER_FILE_ROUTER_PATHS.UPLOAD(engineerId, documentType),
            formData,
            { headers: { "Content-Type": "multipart/form-data", }, }
        );
        return response.data;
    }

    static async getFilesByEngineerId(engineerId: string): Promise<EngineerFile[]> {
        const response = await axiosInstance.get(
            ENGINEER_FILE_ROUTER_PATHS.GET_BY_ENGINEER_ID(engineerId)
        );
        return response.data;
    }
}
