import {
  Controller,
  useFormContext,
  type RegisterOptions,
  type ControllerRenderProps,
} from "react-hook-form";
import React, { useState, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";
import { toast } from "react-toastify";
import type { FileUploadProps } from "./type";

/**
 * A robust file upload component with a drag-and-drop style interface.
 *
 * This component handles file selection, validation (type, size, and content signature),
 * and previewing. For PDFs, it can also validate the page count. It integrates
 * with `react-hook-form` and provides clear user feedback through state changes
 * and toast notifications.
 *
 * @param {FileUploadProps} props - The props for the component.
 * @param {string} props.name - The name of the field for `react-hook-form`.
 * @param {string} [props.label="Upload Document"] - The text label for the input field.
 * @param {boolean} [props.required=false] - Whether the field is mandatory.
 * @param {string} [props.accept=".pdf,.jpeg,.jpg,.png"] - Comma-separated list of allowed file extensions.
 * @param {number} [props.maxSize=358400] - Maximum file size in bytes (default 350 KB).
 * @param {boolean} [props.validatePDF=true] - Whether to perform PDF-specific validation.
 * @param {number} [props.minPages=1] - Minimum number of pages for a PDF.
 * @param {number} [props.maxPages=5] - Maximum number of pages for a PDF.
 */
export const FileUpload = ({
  name,
  label = "Upload Document",
  required = false,
  accept = ".pdf,.jpeg,.jpg,.png",
  minSize = 50 * 1024, // ✅ Minimum file size: 50 KB
  maxSize = 350 * 1024, // ✅ Maximum file size: 350 KB
  containerClassName = "flex flex-col py-1",
  placeholder = "upload a document",
  validatePDF = true,
  minPages = 1,
  disabled = false,
  maxPages = 5,
  isShowLabel = true,
}: FileUploadProps) => {
  const { control, getValues } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // ✅ Setup PDF.js worker once
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !pdfjsLib.GlobalWorkerOptions.workerSrc
    ) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }
  }, []);

  // ✅ PDF validation (signature + page count)
  const validatePdfPages = useCallback(
    async (
      file: File
    ): Promise<{ error: string | null; pages: number | null }> => {
      if (!validatePDF) return { error: null, pages: null };

      if (file.size < 100) {
        return { error: "File is too small to be a valid PDF.", pages: null };
      }

      try {
        const headerBuffer = await file.slice(0, 4).arrayBuffer();
        const headerBytes = new Uint8Array(headerBuffer);
        const isGenuinePDF =
          headerBytes[0] === 0x25 &&
          headerBytes[1] === 0x50 &&
          headerBytes[2] === 0x44 &&
          headerBytes[3] === 0x46;

        if (!isGenuinePDF) {
          return { error: "File is not a genuine PDF document.", pages: null };
        }
      } catch (err) {
        console.error("PDF signature check failed:", err);
        return { error: "Unable to verify PDF file integrity.", pages: null };
      }

      try {
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
      } catch (err: unknown) {
        console.error("PDF parsing error:", err);
        let message = "Unable to process PDF. Please upload a valid PDF file.";
        if (err instanceof Error) {
          if (err.name === "InvalidPDFException") {
            message = "File is not a valid PDF document.";
          } else if (err.name === "MissingPDFException") {
            message = "PDF file is corrupted or incomplete.";
          } else if (err.name === "UnexpectedResponseException") {
            message = "PDF file is corrupted or could not be loaded.";
          }
        }
        return { error: message, pages: null };
      }
    },
    [validatePDF, minPages, maxPages]
  );

  // ✅ Load existing form value if present
  useEffect(() => {
    const existingFiles = getValues(name) as FileList | undefined;
    if (existingFiles && existingFiles.length > 0) {
      const file = existingFiles[0];
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      if (file.type === "application/pdf" && validatePDF) {
        validatePdfPages(file).then(({ pages }) => setPageCount(pages));
      }
      setFileUrl(URL.createObjectURL(file));
    }
  }, [getValues, name, validatePDF, validatePdfPages]);

  // ✅ Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  // ✅ Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ✅ Allowed extensions
  const getAcceptExtensions = (): string[] =>
    accept
      .split(",")
      .map((ext) => ext.trim().replace(/^\.?/, "").toLowerCase());

  // ✅ Format allowed types for UI
  const formatAllowedTypes = (): string => {
    const types = getAcceptExtensions().map((ext) => ext.toUpperCase());
    return types.length > 1 ? types.join(", ") : types[0];
  };

  // ✅ Check if file type is allowed
  const isFileTypeAllowed = (file: File): boolean => {
    const allowedExts = getAcceptExtensions();
    return allowedExts.some((ext) =>
      file.name.toLowerCase().endsWith(`.${ext}`)
    );
  };

  // ✅ Validate JPEG & PNG signatures
  const validateJpegSignature = async (file: File): Promise<boolean> => {
    const buffer = await file.slice(0, 2).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return bytes[0] === 0xff && bytes[1] === 0xd8;
  };

  const validatePngSignature = async (file: File): Promise<boolean> => {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const header = new Uint8Array(buffer);
    const expected = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return expected.every((val, i) => val === header[i]);
  };

  // ✅ Main validation and upload handler
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    const files = e.target.files;
    if (!files?.[0]) return;

    const file = files[0];

    // Reset
    setFileName(null);
    setFileSize(null);
    setPageCount(null);
    setFileError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    // 1️⃣ Extension
    if (!isFileTypeAllowed(file)) {
      const errorMsg = `Only ${formatAllowedTypes()} files are allowed.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }

    // 2. Validate size - Updated to reject files below 50KB and above 350KB
    if (file.size < 50 * 1024) {
      const errorMsg = `File size must be at least 50 KB.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }
    if (file.size > maxSize) {
      const errorMsg = `File size must not exceed ${maxSize / 1024} KB.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }

    if (file.size > maxSize) {
      const errorMsg = `File size must not exceed ${(maxSize / 1024).toFixed(
        0
      )} KB.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }

    // 3️⃣ Content validation
    let finalPageCount: number | null = null;
    let isValid = true;
    let validationError = "";
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".pdf")) {
      const { error, pages } = await validatePdfPages(file);
      finalPageCount = pages;
      if (error) {
        validationError = error;
        isValid = false;
      }
    } else if (lowerName.endsWith(".jpeg") || lowerName.endsWith(".jpg")) {
      const isJpeg = await validateJpegSignature(file);
      if (!isJpeg) {
        validationError = "File is not a genuine JPEG image.";
        isValid = false;
      }
    } else if (lowerName.endsWith(".png")) {
      const isPng = await validatePngSignature(file);
      if (!isPng) {
        validationError = "File is not a genuine PNG image.";
        isValid = false;
      }
    }

    if (!isValid) {
      setFileError(validationError);
      toast.error(validationError);
      field.onChange(null);
      return;
    }

    // ✅ Success
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    if (finalPageCount !== null) setPageCount(finalPageCount);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    field.onChange(files);
  };

  // ✅ Remove file
  const handleRemove = (field: ControllerRenderProps) => {
    field.onChange(null);
    setFileName(null);
    setFileSize(null);
    setPageCount(null);
    setFileError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = "";
  };

  // ✅ Re-upload and preview
  const handleReupload = () => document.getElementById(name)?.click();
  const handlePreview = () => fileUrl && window.open(fileUrl, "_blank");

  // ✅ Validation rules for react-hook-form
  const validationRules: RegisterOptions = {
    required: required ? `${label} is required` : false,
    validate: {
      hasFile: (files: FileList | null) => {
        if (!files || files.length === 0) {
          return required ? "File is required" : true;
        }
        return true;
      },
    },
  };

  // ✅ Render
  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label
          className={`block mb-1 text-md font-semibold 
            ${
              disabled
                ? "text-gray-400 dark:text-gray-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
        >
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
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
                className={`relative border-2 border-dashed rounded-md p-6 text-center transition ${
                  disabled
                    ? "border-gray-400  cursor-not-allowed opacity-50"
                    : displayError
                    ? "border-red-500  cursor-pointer"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500  cursor-pointer"
                }`}
                onClick={() =>
                  !fileName && document.getElementById(name)?.click()
                }
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
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {formatAllowedTypes()}• Min 50 KB • Max{" "}
                      {maxSize / 1024} KB
                      {validatePDF &&
                        accept.toLowerCase().includes("pdf") &&
                        ` • ${minPages}–${maxPages} pages`}
                    </p>
                  </>
                )}

                <input
                  id={name}
                  type="file"
                  disabled={disabled}
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

export default FileUpload;
