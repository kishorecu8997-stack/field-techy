import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import { useState, useRef } from "react";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions;
  maxSize?: number;
  accept?: string;
}

/**
 * ImageUploadField - A reusable image upload component for react-hook-form.
 *
 * Displays a circular preview with an edit button.
 * Validates file type and size.
 * Integrates with react-hook-form using Controller.
 */
export const ImageUploadField = ({
  name,
  label,
  required = false,
  rules,
  maxSize = 250 * 1024, // 250 KB
  accept = "image/*",
}: ImageUploadFieldProps) => {
  const { control } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | null) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File size exceeds ${maxSize / (1024)} KB.`);
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Pass file to form state
    onChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    validate: {
      fileType: (value: File | null) => {
        if (!value) return true;
        if (!value.type.startsWith("image/")) {
          return "Please upload a valid image file.";
        }
        return true;
      },
      fileSize: (value: File | null) => {
        if (!value) return true;
        if (value.size > maxSize) {
          return `File size must be less than ${maxSize / 1024} KB.`;
        }
        return true;
      },
      ...rules?.validate,
    },
    ...rules,
  };

  return (
    <div className="flex flex-col py-1">
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
          const { onChange, value } = field;

          // If value is a File, generate preview on mount or change
          if (value instanceof File && !previewUrl) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
          }

          return (
            <>
              <div className="relative inline-block">
                {/* Circular Avatar Preview */}
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      +
                    </div>
                  )}
                </div>

                {/* Edit Button Overlay */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-green-700 hover:bg-green-800 text-white rounded-full flex items-center justify-center transition"
                  aria-label="Edit image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, onChange)}
                  className="hidden"
                />
              </div>

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