import React, { useState } from "react";
import DocumentsList from "./components/DocumentsList";
import { toast } from "react-toastify";
import { initialDocuments } from "@/dummy_data/documents";

/**
 * Props for the Documents component.
 */
interface DrawerMenuProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
}
/**
 * The Documents component manages and displays a user's documents.
 * @param {DrawerMenuProps} props - The props for the component.
 * @param {function(string): void} props.onMenuItemClick - Callback to navigate to other profile sections.
 * @param {function(): void} props.onClose - Callback to close the parent drawer/sidebar.
 * @returns {React.ReactElement} The rendered Documents component.
 */
const Documents: React.FC<DrawerMenuProps> = ({ onMenuItemClick }) => {
  const [documents, setDocuments] = useState(initialDocuments);
 
  /**
   * Handles the deletion of a document after user confirmation.
   * @param {number} id - The ID of the document to be deleted.
   */
  const handleDeleteDocument = (id: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success("Document deleted successfully.");
    }
  };

  return (
    <>     
      <div className="p-4 max-w-3xl mx-auto">
        <DocumentsList
          documents={documents}          
          onEditDocument={() => onMenuItemClick(`editDocument`)}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>
    </>
  );
};

export default Documents;
