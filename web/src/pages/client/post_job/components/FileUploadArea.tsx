import React, { useState } from "react";

interface FileUploadAreaProps {
  title: string;
  acceptedFormats: string;
  onFileSelect: (file: File | null) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  title,
  acceptedFormats,
  onFileSelect,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileSelect(file);
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mb-2 text-emerald-600 dark:text-emerald-400"
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
        <p
          className="mb-1 font-medium text-gray-800 dark:text-white"
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {acceptedFormats}
        </p>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.png,.jpeg"
          className="hidden"
          id={`file-upload-${title}`}
        />
        <label
          htmlFor={`file-upload-${title}`}
          className="mt-2 text-sm underline cursor-pointer"
        >
          {fileName ? fileName : "Click to upload"}
        </label>
      </div>
    </div>
  );
};

export default FileUploadArea;
