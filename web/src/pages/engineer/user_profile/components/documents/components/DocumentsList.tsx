//DocumentsList.tsx

/**
 * @file DocumentsList.tsx
 * @description A component that renders a list of `DocumentCard` components.
 * It handles the display of documents, provides an "Add" button, and delegates
 * edit/delete actions to parent components via callbacks.
 */
import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React, { useState } from "react";

export interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
  status?: "Pending" | "Approved" | "Rejected";
  expiryDate?: string;
}

interface DocumentsListProps {
  documents: Document[];
  onEditDocument?: (id: number) => void;
  onDeleteDocument?: (id: number) => void;
  onExpiryDateChange?: (id: number, expiryDate: string) => void;
  onAddMoreCertificates?: (files: FileList) => void;
  onAddSingleCertificate?: () => void;
}

/**
 * Renders a list of documents with actions to add, edit, and delete.
 * @param {DocumentsListProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list of documents.
 */
const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onEditDocument,
  onDeleteDocument,
  onExpiryDateChange,
  onAddMoreCertificates,
  onAddSingleCertificate,
}) => {
  /**
   * Invokes the onEditDocument callback with the document's ID.
   * @param {number} id - The unique identifier of the document to edit.
   */
  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  /**
   * Invokes the onDeleteDocument callback with the document's ID.
   * @param {number} id - The unique identifier of the document to delete.
   */
  const handleDelete = (id: number) => {
    onDeleteDocument?.(id);
  };

  // Group documents by title
  const groupedDocuments = documents.reduce((groups, doc) => {
    if (!groups[doc.title]) {
      groups[doc.title] = [];
    }
    groups[doc.title].push(doc);
    return groups;
  }, {} as Record<string, Document[]>);

  return (
    <div className="bg-white rounded-lg ">
      {documents.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedDocuments).map(([title, docs]) => (
            <div key={title} className="space-y-4">
              {docs.map((doc, index) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onExpiryDateChange={onExpiryDateChange}
                  onAddMore={onAddSingleCertificate}
                  id={doc.id}
                  showAddMoreButton={title === "Certificate" && index === docs.length - 1}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No documents added yet. Click "Add Document" to get started.
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
