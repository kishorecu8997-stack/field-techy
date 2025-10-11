import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AVATARS } from "@/dummydata/avatars";

interface ImageUploadFieldProps {
  name: string;
  label?: string; // This is unused, consider removing it or adding a <label> element.
  required?: boolean;
  rules?: RegisterOptions;
  maxSize?: number;
  accept?: string;
}

export const ImageUploadField = ({
  name,
  label,
  required = false,
  rules = {},
  maxSize = 250 * 1024, // 250 KB
  accept = ".jpeg",
}: ImageUploadFieldProps) => {
  const { control, setValue, getValues } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fallbackEmoji, setFallbackEmoji] = useState<string | null>(null); // Stores avatar URL or file URL
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Sync form value with preview/emoji
  useEffect(() => {
    const currentValue = getValues(name);
    if (typeof currentValue === 'string') {
      if (currentValue.startsWith("http")) {
        setFallbackEmoji(currentValue);
        setPreviewUrl(null);
      }
    } else if (currentValue instanceof File) {
      setPreviewUrl(URL.createObjectURL(currentValue));
      setFallbackEmoji(null);
    }
  }, [getValues, name]);

  const validateJPEGSignature = async (file: File): Promise<boolean> => {
    const buffer = await file.slice(0, 2).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return bytes[0] === 0xFF && bytes[1] === 0xD8;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isJPEGMime = file.type === "image/jpeg";
    const hasCorrectExtension = file.name.toLowerCase().endsWith(accept);
    const isValidSignature = await validateJPEGSignature(file);

    if (!isJPEGMime || !hasCorrectExtension || !isValidSignature) {
      toast.error(`Only genuine JPEG files with ${accept} extension are allowed.`);
      return;
    }

    if (file.size < 50 * 1024 || file.size > maxSize) {
      toast.error("File size must be between 50 KB and 250 KB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFallbackEmoji(null); // Clear avatar when real image is uploaded
    onChange(file);
    setIsPopupOpen(false); // Close popup after upload
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleAvatarSelect = (avatar: { id: string; url: string }) => {
    setFallbackEmoji(avatar.url);
    setValue(name, avatar.url, { shouldValidate: true, shouldDirty: true });
    setIsPopupOpen(false);
  };

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    validate: {
      fileType: async (value: File | null) => {
        if (!value || typeof value === 'string') return true;
        const isJPEGMime = value.type === "image/jpeg";
        const hasCorrectExtension = value.name.toLowerCase().endsWith(accept);
        const isValidSignature = await validateJPEGSignature(value);
        if (!isJPEGMime || !hasCorrectExtension || !isValidSignature) {
          return "Only genuine JPEG files with .jpeg extension are allowed.";
        }
        return true;
      },
      fileSize: (value: File | null) => {
        if (!value || typeof value === 'string') return true;
        if (value.size < 50 * 1024 || value.size > maxSize) {
          return "File size must be between 50 KB and 250 KB.";
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
          const { onChange } = field;

          return (
            <>
              <div className="relative inline-block">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-pointer flex items-center justify-center"
                  onClick={handleOpenPopup} // 👈 Open unified popup
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : fallbackEmoji ? (
                    <img
                      src={fallbackEmoji}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenPopup} // 👈 Same click opens popup
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

              {/* Unified Popup: Avatars + Upload */}
              {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  {/* Dark semi-transparent backdrop with blur */}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsPopupOpen(false)}
                  />
                  {/* White card with rounded corners */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl z-10">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                      Choose Your Profile Picture
                    </h3>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar)}
                          className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-teal-500 transition flex items-center justify-center"
                          aria-label={`Select ${avatar.id} avatar`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.id}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Upload Button */}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full py-2 text-sm font-medium text-teal-700 hover:text-teal-800 border border-teal-300 hover:border-teal-500 rounded-lg transition"
                    >
                      🖼️ Upload from Device
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPopupOpen(false)}
                      className="mt-4 w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default ImageUploadField;