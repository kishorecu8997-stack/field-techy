import React, { createContext, useContext, ReactNode } from "react";
import type { ClientFile } from "@/shared/apiServices/client/clientTypes";

interface ClientFilesContextValue {
  files: ClientFile[];
  profilePictureFile: ClientFile | null;
  isLoading: boolean;
  refetch: () => void;
}

const ClientFilesContext = createContext<ClientFilesContextValue | undefined>(
  undefined
);

export const useClientFilesContext = () => {
  const context = useContext(ClientFilesContext);
  return context; // Returns undefined if not in provider
};

interface ClientFilesProviderProps {
  children: ReactNode;
  value: ClientFilesContextValue;
}

export const ClientFilesProvider: React.FC<ClientFilesProviderProps> = ({
  children,
  value,
}) => {
  return (
    <ClientFilesContext.Provider value={value}>
      {children}
    </ClientFilesContext.Provider>
  );
};

