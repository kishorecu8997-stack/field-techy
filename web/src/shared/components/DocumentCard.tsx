import React, { Suspense } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line, RiDownloadCloud2Line } from "react-icons/ri";
import LoaderComponent from "./commonUI/LoaderComponent";

const PDFPreview = React.lazy(() => import("./PdfPreview"));

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
 * @property {boolean} [allowMultiple] - Whether multiple documents of this type can be added.
 */
interface Document {
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
  status?: "Pending" | "Approved" | "Rejected";
  expiryDate?: string;
  allowMultiple?: boolean;
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
  onDownload?: (id: number) => void;
  onExpiryDateChange?: (id: number, expiryDate: string) => void;
  onAddMore?: () => void;
  id: number;
  showAddMoreButton?: boolean;
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
  onDownload,
  onExpiryDateChange,
  onAddMore,
  id,
  showAddMoreButton = false,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [expiryDate, setExpiryDate] = React.useState(document.expiryDate || "");
  const renderPreview = (doc: Document) => {
    if (doc.fileType === "PDF" && doc.previewUrl) {
      return (
        <Suspense
          fallback={
            <div className="w-full h-56 flex items-center justify-center bg-gray-50 rounded-lg border">
              <LoaderComponent />
            </div>
          }
        >
          <PDFPreview key={doc.previewUrl} url={doc.previewUrl} />
        </Suspense>
      );
    }

    if (doc.previewUrl) {
      return (
        <img
          src={doc.previewUrl}
          alt={doc.title}
          className={`w-full h-56 object-cover rounded-lg border ${doc.status === "Rejected" ? "border-red-500" : ""}`}
        />
      );
    }

    return (
      <div
        className={`w-full h-56 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed ${doc.status === "Rejected" ? "border-red-500" : "border-gray-200"}`}
      >
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

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  const handleSaveExpiryDate = () => {
    onExpiryDateChange?.(id, expiryDate);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setExpiryDate(document.expiryDate || "");
    setIsEditing(false);
  };

  const handleAddMoreClick = () => {
    onAddMore?.();
  };

  const isExpiringSoon = React.useMemo(() => {
    if (!document.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(document.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }, [document.expiryDate]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold text-gray-800 truncate"
          title={document.title}
        >
          {document.title}
        </h3>
        {document.allowMultiple && showAddMoreButton && (
          <button
            onClick={handleAddMoreClick}
            className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
            aria-label="Add more certificates"
            title="Add more certificates"
          >
            +Add More Certificates
          </button>
        )}
      </div>
      {getStatusBadge(document.status)}
      {isExpiringSoon && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
          Expires Soon
        </span>
      )}
      {document.expiryDate && !isEditing && (
        <div className="flex items-center mt-1">
          <p className="text-xs text-gray-600">
            Expires: {document.expiryDate}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Edit expiry date"
            title="Edit expiry date"
          >
            <FaRegEdit className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="relative">
        {renderPreview(document)}

        <div className="absolute right-3 bottom-3 flex items-center space-x-2 z-20">
          {onDownload && (
            <button
              onClick={() => onDownload(id)}
              className="bg-teal-900 hover:bg-teal-950 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
              aria-label="Download document"
              title="Download"
            >
              <RiDownloadCloud2Line />
            </button>
          )}

          <button
            onClick={() => onEdit(id)}
            className="bg-teal-900 hover:bg-teal-950 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Edit document"
            title="Edit"
          >
            <FaRegEdit />
          </button>

          <button
            onClick={() => onDelete(id)}
            className="bg-teal-900 hover:bg-teal-950 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Delete document"
            title="Delete"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <label
            htmlFor={`expiry-date-input-${id}`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Expiry Date
          </label>
          <input
            id={`expiry-date-input-${id}`}
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-describedby={`expiry-date-help-${id}`}
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleSaveExpiryDate}
              className="px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
