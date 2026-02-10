import React from "react";
import DocumentsList from "./components/DocumentsList";

/**
 * Props for the Documents component.
 */
interface DrawerMenuProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
}
/**
 * The Documents component manages and displays a user's documents.
 * DocumentsList now fetches files directly from the API.
 * @param {DrawerMenuProps} props - The props for the component.
 * @param {function(string): void} props.onMenuItemClick - Callback to navigate to other profile sections.
 * @returns {React.ReactElement} The rendered Documents component.
 */
const ClientDocuments: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  return (
    <>
      <div className="p-4 max-w-3xl mx-auto">
        <DocumentsList
          onEditDocument={() => onMenuItemClick(`clientEditDocument`)}
          onAddDocument={() => onMenuItemClick(`clientEditDocument`)}
        />
      </div>
    </>
  );
};

export default ClientDocuments;
