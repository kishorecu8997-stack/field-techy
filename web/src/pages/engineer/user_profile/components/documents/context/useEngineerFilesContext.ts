import { useContext } from "react";
import { EngineerFilesContext } from "./EngineerFilesContext";

export const useEngineerFilesContext = () => {
  const context = useContext(EngineerFilesContext);
  return context; // Returns undefined if not in provider
};

