/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import React, { useState } from "react";

interface InputFieldProps {
  name: string;
  label?: string; // e.g., "Upload Resume/CV"
  required?: boolean;
  accept?: string; // default: ".pdf,.jpg,.png"
  maxSize?: number; // default: 350 * 1024 (350KB)
  containerClassName?: string;
  placeholder?: string;
}

/**
 * FileUploadField - Upload box that matches your preview design exactly.
 *
 * Features:
 * - Dashed border box with upload icon (both upload & preview states)
 * - In preview: Shows "Uploaded: filename", size, "Re-upload" + "Remove" buttons
 * - Validates file size (≤ 350KB) and type
 * - Integrates with react-hook-form via Controller
 */
export const FileUpload = ({
  name,
  label,
  required = false,
  placeholder = "Upload Resume/CV",
  accept = ".pdf,.jpg,.png",
  maxSize = 350 * 1024, // 350 KB
  containerClassName = "flex flex-col py-1",
}: InputFieldProps) => {
  const { control } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  // Validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label} is required` : false,
    validate: {
      fileSize: (files: FileList) => {
        if (!files || files.length === 0)
          return required ? "File is required" : true;
        const file = files[0];
        if (file.size > maxSize)
          return `File must be under ${maxSize / 1024} KB`;
        setFileSize(formatFileSize(file.size));
        setFileName(file.name);
        return true;
      },
      fileType: (files: FileList) => {
        if (!files || files.length === 0) return true;
        const file = files[0];
        const acceptedExtensions = accept
          .split(",")
          .map((ext) => ext.trim().toLowerCase());

        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const isValidExtension =
          fileExtension && acceptedExtensions.includes(`.${fileExtension}`);

        return (
          isValidExtension ||
          `Only ${acceptedExtensions
            .map((ext) => ext.replace(".", "").toUpperCase())
            .join(", ")} files are allowed`
        );
      },
    },
  };

  // Helper: Format file size (KB/MB)
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Handle file change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      field.onChange(files);
      setFileName(files[0].name);
      setFileSize(formatFileSize(files[0].size));
    }
  };

  // Handle remove file
  const handleRemove = (field: any) => {
    field.onChange(null); // Clear form value
    setFileName(null);
    setFileSize(null);
    // Reset input so user can re-select same file if needed
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = "";
  };

  // Handle "Re-upload" click
  const handleReupload = () => {
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.click();
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
          return (
            <>
              <div
                className={`relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center cursor-pointer transition ${
                  error ? "border-red-400" : ""
                }`}
                onClick={() =>
                  !fileName && document.getElementById(name)?.click()
                }
              >
                {/* Always show upload icon */}
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
                  // ✅ PREVIEW MODE: Show uploaded info + buttons
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Uploaded: <span className="font-normal">{fileName}</span>
                    </p>
                    {fileSize && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Size: {fileSize}
                      </p>
                    )}

                    <div className="flex justify-center space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={handleReupload}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
                      >
                        Re-upload
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(field)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  // ❌ UPLOAD MODE: Show label + format hint
                  <>
                    <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {placeholder}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Format:{" "}
                      {accept
                        .replace(/\./g, "")
                        .replace(/,/g, ", ")
                        .toUpperCase()}
                    </p>
                  </>
                )}

                {/* Hidden File Input */}
                <input
                  id={name}
                  type="file"
                  accept={accept}
                  onChange={(e) => handleChange(e, field)}
                  className="hidden"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
