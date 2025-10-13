/**
 * @file DocumentsList.tsx
 * @description A component that renders a list of `DocumentCard` components.
 * It handles the display of documents, provides an "Add" button, and delegates
 * edit/delete actions to parent components via callbacks.
 */
import DocumentCard from '@/shared/components/DocumentCard';
import React from 'react';

/**
 * Represents a single document with its metadata.
 * @interface Document
 */
export interface Document {
  /** A unique identifier for the document. */
  id: number;
  /** The display title of the document. */
  title: string;
  /** The original file name of the document. */
  fileName: string;
  /** The type of the file (e.g., PDF, JPEG). */
  fileType: 'PDF' | 'PNG' | 'JPEG' | 'JPG' | 'GIF' | 'DOCX' | 'XLSX';
  /** A URL to a preview image or the document itself. */
  previewUrl?: string;
  /** The date the document was uploaded, in string format. */
  uploadDate?: string;
  /** A brief description of the document. */
  description?: string;
  /** A key-value store for any additional metadata. */
  metadata?: Record<string, string>;
}

/**
 * Props for the DocumentsList component.
 * @interface DocumentsListProps
 */
interface DocumentsListProps {
  /** An array of document objects to be displayed. */
  documents: Document[];
  /** Optional callback function to handle adding a new document. */
  onAddDocument?: () => void;
  /** Optional callback function to handle editing a document, identified by its numeric ID. */
  onEditDocument?: (id: number) => void;
  /** Optional callback function to handle deleting a document, identified by its numeric ID. */
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
  onDeleteDocument
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

  return (
    <div className="bg-white rounded-lg ">
        {onAddDocument && (
      <div className="flex justify-end items-center mb-4">        
          <button 
            onClick={onAddDocument}
            className="text-blue-600 hover:text-blue-800 font-medium flex gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Document
          </button>
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