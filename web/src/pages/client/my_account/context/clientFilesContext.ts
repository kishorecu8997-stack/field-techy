import { createContext } from "react";
import type { ClientFile } from "@/shared/apiServices/client/clientTypes";

export interface ClientFilesContextValue {
  files: ClientFile[];
  profilePictureFile: ClientFile | null;
  isLoading: boolean;
  refetch: () => void;
}

export const ClientFilesContext = createContext<ClientFilesContextValue | undefined>(
  undefined
);

