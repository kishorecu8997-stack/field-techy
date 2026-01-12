import { useContext } from "react";
import { ClientFilesContext } from "./clientFilesContext";

export const useClientFilesContext = () => {
  const context = useContext(ClientFilesContext);
  return context; // Returns undefined if not in provider
};
