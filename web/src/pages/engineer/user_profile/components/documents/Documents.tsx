/**
 * @file Documents.tsx
 * @description This component renders the documents section of a user's profile.
 * It displays a list of documents and provides functionality for adding, editing,
 * and deleting them. It's designed to be displayed within a drawer or a similar container.
 */

import React, { useState } from "react";
import DocumentsList from "./components/DocumentsList";
import type { Document } from "./components/DocumentsList";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { toast } from "react-toastify/unstyled";

// Local document/image assets from src/assets/document
import img8140054 from "@/assets/document/8140054.jpg";
import img8351119 from "@/assets/document/8351119.jpg";
import imgExampleJpg from "@/assets/document/file_example_JPG_100kB.jpg";
import sampleLocalPdf from "@/assets/document/sample-local-pdf.pdf";

/**
 * Initial sample data for documents.
 * This data is used to populate the documents list for demonstration and development purposes.
 * It includes various file types like JPEG and PDF, with metadata.
 */
const initialDocuments = [
 {
    id: 1,
    title: "Scanned Document - 8140054",
    fileName: "8140054.jpg",
    fileType: "JPEG",
    previewUrl: img8140054,
    uploadDate: "2022-11-01",
    description: "Scanned document image stored locally in assets/document",
    metadata: {
      Source: "Local assets/document",
      Note: "Image for preview/testing",
    },
  },
  {
    id: 2,
    title: "Scanned Document - 8351119",
    fileName: "8351119.jpg",
    fileType: "JPEG",
    previewUrl: img8351119,
    uploadDate: "2022-11-02",
    description: "Scanned document image stored locally in assets/document",
    metadata: {
      Source: "Local assets/document",
    },
  },
  {
    id: 3,
    title: "Example JPEG",
    fileName: "file_example_JPG_100kB.jpg",
    fileType: "JPEG",
    previewUrl: imgExampleJpg,
    uploadDate: "2021-06-15",
    description: "Example JPEG file included in project assets",
    metadata: {
      Size: "~100KB",
    },
  },
  {
    id: 4,
    title: "Sample PDF",
    fileName: "sample-local-pdf.pdf",
    fileType: "PDF",
    previewUrl: sampleLocalPdf,
    uploadDate: "2021-06-16",
    description: "Sample local PDF stored in assets/document",
    metadata: {
      Pages: "2",
    },
  },
] as Document[];


/**
 * Props for the Documents component.
 */
interface DrawerMenuProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}
/**
 * The Documents component manages and displays a user's documents.
 * @param {DrawerMenuProps} props - The props for the component.
 * @param {function(string): void} props.onMenuItemClick - Callback to navigate to other profile sections.
 * @param {function(): void} props.onClose - Callback to close the parent drawer/sidebar.
 * @returns {React.ReactElement} The rendered Documents component.
 */
const Documents: React.FC<DrawerMenuProps> = ({ onMenuItemClick, onClose }) => {
  const [documents, setDocuments] = useState(initialDocuments);

  /**
   * Handles the action for adding a new document.
   * Currently, it shows a placeholder toast message.
   */
  const handleAddDocument = () => {
    toast.error("Add Document functionality not implemented yet.");
  };

  /**
   * Handles the action for editing an existing document.
   * @param {number} id - The ID of the document to be edited.
   */
  const handleEditDocument = (id: number) => {
    toast.error(`Edit document #${id} functionality not implemented yet.`);
  };

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
      {/* Header */}
      <DrawerHeader
        title="Documents"
        onClose={onClose}
        onBack={() => {
          // When user clicks back, open Add Education view. This will allow returning back to this page
          onMenuItemClick("profile");
        }}
      />
      <div className="p-4 max-w-3xl mx-auto">
        <DocumentsList
          documents={documents}          
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>
    </>
  );
};

export default Documents;
