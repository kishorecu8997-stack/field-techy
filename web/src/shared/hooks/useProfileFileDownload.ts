import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserId } from "@/utils";
import { appDownloadProfileFile, type AppDownloadProfileFileResponse } from "@/api";
import { apiClient as engineerApiClient } from "@/shared/apiServices/engineer/engineerOpenApiService";
import { apiClient as clientApiClient } from "@/shared/apiServices/client/clientOpenApiService";

export interface UseProfileFileDownloadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: unknown) => void;
}

/**
 * Custom hook to handle profile file download:
 * 1. Get presigned download URL
 * 2. Optionally trigger browser download
 * 
 * Works for both Engineer and Client contexts based on URL path.
 */
export const useProfileFileDownload = (options?: UseProfileFileDownloadOptions) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const path = useLocation();

  const downloadProfileFile = async (fileId: string, fileName?: string) => {
    if (!fileId) return;
    
    setIsDownloading(true);
    const isEngineer = path.pathname.includes("engineer");
    const apiClient = isEngineer ? engineerApiClient : clientApiClient;

    try {
      const response = await appDownloadProfileFile({
        client: apiClient,
        query: { fileId },
        headers: { authorization: "" },
        throwOnError: true,
      });

      const data = response.data as AppDownloadProfileFileResponse;
      const downloadUrl = data?.downloadUrl;

      if (downloadUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement("a");
        link.href = downloadUrl;
        if (fileName) {
          link.setAttribute("download", fileName);
        }
        link.target = "_blank"; // Open in new tab or trigger download
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
