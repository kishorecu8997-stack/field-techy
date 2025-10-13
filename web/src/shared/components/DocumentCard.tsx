// DocumentCard.tsx
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import PDFPreview from "./PdfPreview";

/**
 * Represents a user-uploaded document and its basic metadata.
 *
 * @property {string} title - Human-readable title for the document.
 * @property {string} fileName - Original filename including extension.
 * @property {'PDF'|'PNG'|'JPEG'|'JPG'|'GIF'|'DOCX'|'XLSX'} fileType - High-level file type.
 * @property {string} [previewUrl] - Optional URL to an image preview (e.g. PDF first page or image file).
 * @property {string} [uploadDate] - Optional ISO date string or formatted date when the file was uploaded.
 * @property {string} [description] - Optional user-provided description for the document.
 * @property {Record<string,string>} [metadata] - Optional additional key/value metadata.
 */
interface Document {
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Props accepted by the DocumentCard component.
 *
 * @property {Document} document - The document data to render.
 * @property {(id: number) => void} onEdit - Callback invoked when the edit button is pressed.
 * @property {(id: number) => void} onDelete - Callback invoked when the delete button is pressed.
 * @property {number} id - Numeric identifier used when invoking callbacks.
 */
interface DocumentCardProps {
  document: Document;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  id: number;
}

/**
 * Small presentational component that shows a document preview and floating actions.
 *
 * The component intentionally keeps file-type icons/details hidden per the current design
 * and focuses on showing an image preview (when available) and action buttons.
 *
 * @param {DocumentCardProps} props - Component props.
 * @returns {JSX.Element} Rendered document card.
 */
const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onDelete,
  id,
}) => {
  // We only need preview logic now; file icons/details are hidden per design

  // Helper: render preview. For PDFs we attempt to show the provided previewUrl
  // (assumed to be the first-page image) or a PDF icon placeholder.
  /**
   * Render a visual preview for the provided document.
   * If a previewUrl is available we render an <img>, otherwise a dashed placeholder.
   *
   * @param {Document} doc - Document to render the preview for.
   * @returns {JSX.Element} Preview element.
   */
  //   const renderPreview = (doc: Document) => {

  //     if (doc.previewUrl) {
  //       // For images or a generated PDF-first-page image
  //       return (
  //         <img
  //           src={doc.previewUrl}
  //           alt={doc.title}
  //           className="w-full h-56 object-cover rounded-lg  border"
  //         />
  //       );
  //     }

  //     // Fallback placeholder for files without preview
  //     return (
  //       <div className="w-full h-56 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
  //         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
  //           <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" />
  //         </svg>
  //       </div>
  //     );
  //   };

  const renderPreview = (doc: Document) => {
    if (doc.fileType === "PDF" && doc.previewUrl) {        
      return <PDFPreview url={doc.previewUrl} />;
    }

    if (doc.previewUrl) {
      return (
        <img
          src={doc.previewUrl}
          alt={doc.title}
          className="w-full h-56 object-cover rounded-lg border"
        />
      );
    }

    return (
      <div className="w-full h-56 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Title at the top of details */}
      <h3
        className="text-sm font-semibold text-gray-800 truncate"
        title={document.title}
      >
        {document.title}
      </h3>
      {/* Preview area only (image or first page of PDF) */}
      {renderPreview(document)}

      {/* Floating action buttons bottom-right */}
      <div className="absolute right-3 bottom-3 flex items-center space-x-2 z-20">
        <button
          onClick={() => onEdit(id)}
          className="bg-teal-900 hover:bg-teal-950 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
          aria-label="Edit document"
          title="Edit"
        >
          <FaRegEdit />
        </button>

        <button
          onClick={() => onDelete(id)}
          className="bg-teal-900 hover:bg-teal-950 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
          aria-label="Delete document"
          title="Delete"
        >
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
