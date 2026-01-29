import { useState } from "react";
import { getUserId } from "@/utils";
import {
  appDownloadProfileFile,
  type AppDownloadProfileFileResponse,
} from "@/api";
import { apiClient } from "@/shared/apiServices/apiClient";

export interface UseProfileFileDownloadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: unknown) => void;
}

/**
 * Custom hook to handle profile file download:
 * 1. Get presigned download URL
 * 2. Optionally trigger browser download
 */
export const useProfileFileDownload = (
  options?: UseProfileFileDownloadOptions,
) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadProfileFile = async (
    fileType: "profilePicture" | "resumeFile" | "govIdDoc" | "certificateDoc",
    fileName?: string,
  ) => {
    if (!fileType) return;
    setIsDownloading(true);

    try {
      const response = await appDownloadProfileFile({
        client: apiClient,
        query: { fileType },
        headers: { authorization: "" },
        throwOnError: true,
      });

      const data = response.data as AppDownloadProfileFileResponse;
      const downloadUrl = data?.downloadUrl;

      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        if (fileName) {
          link.setAttribute("download", fileName);
        }
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        options?.onSuccess?.(downloadUrl);
        return downloadUrl;
      } else {
        throw new Error("Download URL not found in response");
      }
    } catch (error) {
      console.error("Download error:", error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const userId = getUserId();

  return {
    downloadProfileFile,
    isDownloading,
    userId,
  };
};
