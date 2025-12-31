import React, { type ReactNode } from "react";
import {
  ClientFilesContext,
  type ClientFilesContextValue,
} from "./clientFilesContext";

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
