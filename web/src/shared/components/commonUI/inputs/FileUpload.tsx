/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";
import { toast } from "react-toastify";
import type { InputFieldProps } from "./type";



export const FileUpload = ({
  name,
  label = "Upload Document",
  required = false,
  accept = ".pdf,.jpeg,.jpg,.png",
  maxSize = 350 * 1024, // 350 KB
  containerClassName = "flex flex-col py-1",
  placeholder = "Upload Resume/CV",
  validatePDF = true,
  minPages = 1,
  maxPages = 5,
}: InputFieldProps) => {
  const { control } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Set PDF.js worker on component mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }
  }, []);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get allowed extensions
  const getAcceptExtensions = (): string[] => {
    return accept
      .split(",")
      .map((ext) => ext.trim().replace(/^\.?/, ""))
      .map((ext) => ext.toLowerCase());
  };

  // Format allowed types for display
  const formatAllowedTypes = (): string => {
    const types = getAcceptExtensions().map(ext => ext.toUpperCase());
    return types.length > 1 ? types.join(", ") : types[0];
  };

  // Check if file type is allowed by extension
  const isFileTypeAllowed = (file: File): boolean => {
    const allowedExts = getAcceptExtensions();
    return allowedExts.some((ext) =>
      file.name.toLowerCase().endsWith(`.${ext}`)
    );
  };

  // ✅ Validate genuine JPEG
  const validateJpegSignature = async (file: File): Promise<boolean> => {
    const buffer = await file.slice(0, 2).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return bytes[0] === 0xff && bytes[1] === 0xd8;
  };

  // ✅ Validate genuine PNG
  const validatePngSignature = async (file: File): Promise<boolean> => {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const header = new Uint8Array(buffer);
    const expected = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return expected.every((val, i) => val === header[i]);
  };

  // ✅ Validate PDF: signature + page count
  const validatePdfPages = async (file: File): Promise<{ error: string | null; pages: number | null }> => {
    if (!validatePDF) return { error: null, pages: null };

    // Step 1: Check %PDF header
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

    // Step 2: Parse and validate pages
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

  // ✅ Handle file change with full validation
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const files = e.target.files;
    if (!files?.[0]) return;

    const file = files[0];

    // Reset state
    setFileName(null);
    setFileSize(null);
    setPageCount(null);
    setFileError(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    // 1. Validate extension
    if (!isFileTypeAllowed(file)) {
      const errorMsg = `Only ${formatAllowedTypes()} files are allowed.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }

    // 2. Validate size
    if (file.size > maxSize) {
      const errorMsg = `File size must not exceed ${maxSize / 1024} KB.`;
      setFileError(errorMsg);
      toast.error(errorMsg);
      field.onChange(null);
      return;
    }

    let finalPageCount: number | null = null;
    let isValid = true;
    let validationError = "";

    const lowerName = file.name.toLowerCase();

    // 3. Validate by file type
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

    // Set preview
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    if (finalPageCount !== null) {
      setPageCount(finalPageCount);
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    field.onChange(files);
  };

  // Remove file
  const handleRemove = (field: any) => {
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

  // Re-upload
  const handleReupload = () => {
    document.getElementById(name)?.click();
  };

  // Preview
  const handlePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  // Validation rules
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

export default FileUpload;