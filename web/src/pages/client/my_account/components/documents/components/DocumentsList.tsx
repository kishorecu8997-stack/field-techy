import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React from "react";

export interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
}

interface DocumentsListProps {
  documents: Document[];
  onAddDocument?: () => void;
  onEditDocument?: (id: number) => void;
  onDeleteDocument?: (id: number) => void;
}

/**
 * Renders a list of documents with actions to add, edit, and delete.
 * @param {DocumentsListProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list of documents.
 */
const DocumentsList: React.FC<DocumentsListProps> = ({  
  documents,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}) => {
  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  const handleDelete = (id: number) => {
    onDeleteDocument?.(id);
  };

  return (
    <div className="bg-white rounded-lg ">
      {onAddDocument && (
        <div className="flex justify-end items-center mb-4">
          <Button
            variant="link"
            onClick={onAddDocument}
            className="text-blue-600 hover:text-blue-800 font-medium flex gap-1"
          >
            Add Document
          </Button>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={handleEdit}
              onDelete={handleDelete}
              id={doc.id}
            />
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
