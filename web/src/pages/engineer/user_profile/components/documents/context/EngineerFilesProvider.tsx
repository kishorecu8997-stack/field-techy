import React, { type ReactNode } from "react";
import {
  EngineerFilesContext,
  type EngineerFilesContextValue,
} from "./EngineerFilesContext";

interface EngineerFilesProviderProps {
  children: ReactNode;
  value: EngineerFilesContextValue;
}

export const EngineerFilesProvider: React.FC<EngineerFilesProviderProps> = ({
  children,
  value,
}) => {
  return (
    <EngineerFilesContext.Provider value={value}>
      {children}
    </EngineerFilesContext.Provider>
  );
};
