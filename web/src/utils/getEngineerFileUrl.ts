import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import type { ManageEngineerProps } from "@/pages/admin/engineer/types";

/**
 * Returns engineer document URL based on file type
 */
export const getEngineerFileUrl = (
  engineer: ManageEngineerProps | null | undefined,
  type?: ProfileFileType | null,
): string | null => {
  if (!engineer || !type) return null;

  const fileMap: Record<ProfileFileType, { url?: string } | undefined> = {
    profilePicture: engineer.profilePicture,
    resumeFile: engineer.resumeFile,
    govIdDoc: engineer.govIdDoc,
    certificateDoc: engineer.certificateDoc,
  };

  return fileMap[type]?.url ?? null;
};
