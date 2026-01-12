import { createContext } from "react";
import type { EngineerFile } from "@/shared/apiServices/engineer/engineerTypes";

export interface EngineerFilesContextValue {
  files: EngineerFile[];
  profilePictureFile: EngineerFile | null;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * A context for engineer files.
 *
 * This context provides a way to access engineer files and related information.
 * It is designed to be used within a `EngineerFilesProvider` to provide the files context to child components.
 *
 * @example
 * <EngineerFilesProvider>
 *   <EngineerFilesContext.Provider value={filesContextValue}>
 *     <Documents />
 *   </EngineerFilesContext.Provider>
 * </EngineerFilesProvider>
 */
export const EngineerFilesContext = createContext<
  EngineerFilesContextValue | undefined
>(undefined);
