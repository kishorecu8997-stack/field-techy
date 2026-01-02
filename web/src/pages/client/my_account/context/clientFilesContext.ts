import { createContext } from "react";
import type { ClientFile } from "@/shared/apiServices/client/clientTypes";

export interface ClientFilesContextValue {
  files: ClientFile[];
  profilePictureFile: ClientFile | null;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * A context for client files.
 *
 * This context provides a way to access client files and related information.
 * It is designed to be used within a `ClientFilesProvider` to provide the files context to child components.
 *
 * @example
 * <ClientFilesProvider>
 *   <ClientFilesContext.Provider value={filesContextValue}>
 *     <ClientFiles />
 *   </ClientFilesContext.Provider>
 * </ClientFilesProvider>
 *
 * @param {ClientFilesContextValue} value - The value for the context.
 * @returns {ClientFilesContextValue | undefined} The context value.
 */
export const ClientFilesContext = createContext<
  ClientFilesContextValue | undefined
>(undefined);
