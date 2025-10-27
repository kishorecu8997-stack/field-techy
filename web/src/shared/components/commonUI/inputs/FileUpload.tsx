/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface InputFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSize?: number;
  containerClassName?: string;
  placeholder?: string;
  validatePDF?: boolean;
  minPages?: number;
  maxPages?: number;
}

/**
 * A reusable file upload component for react-hook-form.
 * It provides an interface for uploading files, showing a preview of the file name, size, and page count (for PDFs).
 * Includes robust validation for file type, size, and genuine PDF signatures and page counts.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.name - The name of the form field.
 * @param {string} [props.label="Upload Document"] - The label for the input field.
 * @param {boolean} [props.required=false] - Whether the field is required.
 * @param {string} [props.accept=".pdf"] - Comma-separated string of allowed file extensions (e.g., ".pdf,.docx").
 * @param {number} [props.maxSize=358400] - Maximum file size in bytes (defaults to 350 KB).
 * @param {string} [props.containerClassName] - Tailwind CSS classes for the container.
 * @param {string} [props.placeholder="Upload Resume/CV"] - Placeholder text.
 * @param {boolean} [props.validatePDF=true] - Whether to perform PDF-specific validation.
 * @param {number} [props.minPages=1] - Minimum number of pages for a PDF.
 * @param {number} [props.maxPages=5] - Maximum number of pages for a PDF.
 */
export const FileUpload = ({
  name,
  label = "Upload Document",
  required = false,
  accept = ".pdf",
  maxSize = 350 * 1024,
  containerClassName = "flex flex-col py-1",
  placeholder = "Upload Resume/CV",
  validatePDF = true,
  minPages = 1,
  maxPages = 5,
}: InputFieldProps) => {
  const { control } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null); // ✅ New state
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAcceptExtensions = (): string[] => {
    return accept
      .split(",")
      .map((ext) => ext.trim().replace(/^\.?/, ""))
      .map((ext) => ext.toLowerCase());
  };

  const formatAllowedTypes = (): string => {
    const types = getAcceptExtensions().map(ext => ext.toUpperCase());
    return types.length > 1 ? types.join(", ") : types[0];
  };

  const isFileTypeAllowed = (file: File): boolean => {
    const allowedExts = getAcceptExtensions();
    return allowedExts.some((ext) =>
      file.name.toLowerCase().endsWith(`.${ext}`)
    );
  };

  // ✅ Lazy load PDF.js to reduce initial bundle size
  const getPDFJS = async () => {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    const pdfWorker = (await import("pdfjs-dist/legacy/build/pdf.worker.min?url")).default;

    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }

    return pdfjsLib;
  };

  // ✅ Return both error AND page count
  // ✅ Enhanced: Genuine PDF validation + page count
const validatePdfPages = async (file: File): Promise<{ error: string | null; pages: number | null }> => {
  if (!validatePDF) return { error: null, pages: null };

  // ✅ Step 1: Check genuine PDF signature (%PDF in first 4 bytes)
  try {
    const headerBuffer = await file.slice(0, 4).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);
    const isGenuinePDF =
      headerBytes[0] === 0x25 && // '%'
      headerBytes[1] === 0x50 && // 'P'
      headerBytes[2] === 0x44 && // 'D'
      headerBytes[3] === 0x46;   // 'F'

    if (!isGenuinePDF) {
      return { error: "File is not a genuine PDF document.", pages: null };
    }
  } catch (sigError) {
    console.error("PDF signature check failed:", sigError);
    return { error: "Unable to verify PDF file integrity.", pages: null };
  }

  // ✅ Step 2: Validate structure and page count
  try {
    const pdfjsLib = await getPDFJS();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    if (numPages < minPages || numPages > maxPages) {
      return {
        error: `PDF must have between ${minPages} and ${maxPages} pages.`,
        pages: numPages,
      };
    }

    return { error: null, pages: numPages };
  } catch (err: any) {
    console.error("PDF parsing error:", err);
    let message = "Unable to process PDF. Please upload a valid PDF file.";
    if (err?.name === "InvalidPDFException") {
      message = "File is not a valid PDF document.";
    } else if (err?.name === "MissingPDFException") {
      message = "PDF file is corrupted or incomplete.";
    }
    return { error: message, pages: null };
  }
};

 const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any
) => {
  const files = e.target.files;
  if (!files?.[0]) return;

  const file = files[0];

  // ✅ Clear all preview state immediately
  setFileName(null);
  setFileSize(null);
  setPageCount(null);
  setFileError(null);
  if (fileUrl) {
    URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
  }

  // 1. Validate file type
  if (!isFileTypeAllowed(file)) {
    const errorMsg = `Only ${formatAllowedTypes()} files are allowed.`;
    setFileError(errorMsg);
    toast.error(errorMsg); // ✅ Show toast
    field.onChange(null);
    return;
  }

  // 2. Validate file size
  if (file.size > maxSize) {
    const errorMsg = `File size must not exceed ${maxSize / 1024} KB.`;
    setFileError(errorMsg);
    toast.error(errorMsg); // ✅ Show toast
    field.onChange(null);
    return;
  }

  let finalPageCount: number | null = null;

  // 3. Validate PDF (if applicable)
  if (accept.toLowerCase().includes("pdf") && file.name.toLowerCase().endsWith(".pdf")) {
    const { error, pages } = await validatePdfPages(file);
    finalPageCount = pages;
    if (error) {
      setFileError(error);
      toast.error(error); // ✅ Show toast for PDF errors (including "not genuine")
      field.onChange(null);
      return;
    }
  }

  // ✅ Set preview data
  setFileName(file.name);
  setFileSize(formatFileSize(file.size));
  if (finalPageCount !== null) {
    setPageCount(finalPageCount);
  }
  const url = URL.createObjectURL(file);
  setFileUrl(url);
  field.onChange(files);
};
  
  const handleRemove = (field: any) => {
    field.onChange(null);
    setFileName(null);
    setFileSize(null);
    setPageCount(null); // ✅ Clear on remove
    setFileError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleReupload = () => {
    document.getElementById(name)?.click();
  };

  const handlePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const validationRules: RegisterOptions = {
    required: required ? `${label} is required` : false,
    validate: {
      hasFile: (files: FileList) => {
        if (!files || files.length === 0) {
          return required ? "File is required" : true;
        }
        return true;
      },
    },
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const displayError = error?.message || fileError;

          return (
            <>
              <div
                className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
                  displayError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onClick={() => !fileName && document.getElementById(name)?.click()}
              >
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                {fileName ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Uploaded: <span className="font-normal">{fileName}</span>
                    </p>
                    {fileSize && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Size: {fileSize}
                      </p>
                    )}
                    {/* ✅ Show page count only for PDFs */}
                    {pageCount !== null && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Pages: {pageCount}
                      </p>
                    )}
                    <div className="flex justify-center space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={handleReupload}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
                      >
                        Re-upload
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(field)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {placeholder}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Format: {formatAllowedTypes()} • Max {maxSize / 1024} KB
                      {validatePDF && accept.toLowerCase().includes("pdf") && ` • ${minPages}–${maxPages} pages`}
                    </p>
                  </>
                )}

                <input
                  id={name}
                  type="file"
                  accept={accept}
                  onChange={(e) => handleChange(e, field)}
                  className="hidden"
                />
              </div>

              {displayError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {displayError}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};