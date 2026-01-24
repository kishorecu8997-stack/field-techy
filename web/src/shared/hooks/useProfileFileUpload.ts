import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getUserId } from "@/utils";
import { useClientStore } from "@/shared/store/useClientStore";
import {
  useAppUploadProfileFile as useEngineerUploadProfileFile,
  useAppMarkProfileFileUploaded as useEngineerMarkProfileFileUploaded,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import {
  useAppUploadProfileFile as useClientUploadProfileFile,
  useAppMarkProfileFileUploaded as useClientMarkProfileFileUploaded,
} from "@/shared/apiServices/client/clientOpenApiService";

export type ProfileFileType = 'profilePicture' | 'resumeFile' | 'govIdDoc' | 'certificateDoc';

export interface UseProfileFileUploadOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: unknown) => void;
}

/**
 * Custom hook to handle the 3-step profile file upload process:
 * 1. Initiate upload (get presigned URL)
 * 2. Upload raw file to S3
 * 3. Mark as uploaded in the database
 * 
 * Works for both Engineer and Client contexts based on URL path.
 */
export const useProfileFileUpload = (options?: UseProfileFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const path = useLocation();
  const queryClient = useQueryClient();
  const userId = getUserId();
  const fetchClientProfile = useClientStore((state) => state.fetchClientProfile);

  // Engineer Hooks
  const { mutateAsync: initiateEngineerUpload } = useEngineerUploadProfileFile();
  const { mutateAsync: markEngineerUploaded } = useEngineerMarkProfileFileUploaded();

  // Client Hooks
  const { mutateAsync: initiateClientUpload } = useClientUploadProfileFile();
  const { mutateAsync: markClientUploaded } = useClientMarkProfileFileUploaded();

  const uploadProfileFile = async (file: File, fileType: ProfileFileType) => {
    setIsUploading(true);
    const isEngineer = path.pathname.includes("engineer");

    try {
      // 1. Initiate Upload
      const initiate = isEngineer ? initiateEngineerUpload : initiateClientUpload;
      const { fileId, uploadUrl } = await initiate({
        fileType,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      });

      // 2. Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload to S3");

      // 3. Mark as Uploaded
      const markUploaded = isEngineer ? markEngineerUploaded : markClientUploaded;
      const response = await markUploaded({ fileId });

      // Handle post-upload updates
      if (!isEngineer && userId) {
        fetchClientProfile(userId);
      }

      // Invalidate relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: isEngineer ? ["engineer"] : ["client"] });

      options?.onSuccess?.(response);
      return response;

    } catch (error) {
      console.error("Upload error:", error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadProfileFile,
    isUploading,
    userId,
  };
};
