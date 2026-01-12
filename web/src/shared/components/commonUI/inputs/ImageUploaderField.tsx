import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AVATARS } from "@/dummy_data/avatars";
import type { ImageUploadFieldProps } from "./type";
import LoaderComponent from "../LoaderComponent";

// Helper: Validate if image is truly decodable (not corrupted)
const validateImageDecodable = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Full image validation: signature + decodability
const validateImageFile = async (
  file: File,
): Promise<{ valid: boolean; type: "jpeg" | "png" | null }> => {
  // Step 1: Validate magic bytes
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let detectedType: "jpeg" | "png" | null = null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    detectedType = "jpeg";
  } else if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    detectedType = "png";
  }

  if (!detectedType) {
    return { valid: false, type: null };
  }

  // Step 2: Validate actual image decodability (catches corruption)
  const isDecodable = await validateImageDecodable(file);
  if (!isDecodable) {
    return { valid: false, type: null };
  }

  return { valid: true, type: detectedType };
};

export const ImageUploaderField = ({
  name,
  label,
  required = false,
  rules = {},
  maxSize = 350 * 1024, // 350 KB
  accept = ".jpeg,.jpg,.png",
  allowUpload = true,
  initialImageUrl,
  isLoading = false,
}: ImageUploadFieldProps) => {
  const { control, setValue, getValues, watch } = useFormContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevFileRef = useRef<File | null>(null);
  const initialSetRef = useRef(false);

  // Watch the form value to manage object URLs
  const formValue = watch(name);

  // Set initial image URL if provided (only once)
  useEffect(() => {
    if (initialImageUrl && !initialSetRef.current) {
      const currentValue = getValues(name);
      // Only update if form value is empty or is a different URL
      if (
        !currentValue ||
        (typeof currentValue === "string" && currentValue !== initialImageUrl)
      ) {
        setValue(name, initialImageUrl, { shouldValidate: false });
        initialSetRef.current = true;
      }
    }
  }, [initialImageUrl, name, setValue, getValues]);

  // Manage object URL based on form value (moved out of render)
  useEffect(() => {
    if (typeof formValue === "string") {
      // If value is a string (URL), clean up any object URL
      setObjectUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        prevFileRef.current = null;
        return null;
      });
    } else if (formValue instanceof File) {
      // If value is a File, create object URL if it's a new file
      if (formValue !== prevFileRef.current) {
        setObjectUrl((prevUrl) => {
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          const url = URL.createObjectURL(formValue);
          prevFileRef.current = formValue;
          return url;
        });
      }
    }
  }, [formValue]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    validate: {
      fileType: async (value: File | string | null) => {
        if (!value || typeof value === "string") return true;
        const name = value.name.toLowerCase();
        const hasAllowedExt =
          name.endsWith(".jpeg") ||
          name.endsWith(".jpg") ||
          name.endsWith(".png");
        if (!hasAllowedExt) {
          return "Only .jpeg, .jpg, or .png extensions are allowed.";
        }

        const { valid } = await validateImageFile(value);
        if (!valid) {
          return "Only genuine and uncorrupted JPEG/PNG files are allowed.";
        }

        return true;
      },
      fileSize: (value: File | string | null) => {
        if (!value || typeof value === "string") return true;
        if (value.size < 10 * 1024 || value.size > maxSize) {
          return "File size must be between 10 KB and 350 KB.";
        }
        return true;
      },
      ...rules?.validate,
    },
    ...rules,
  };
  const handleImageClick = () => {
    if (allowUpload) {
      setIsPopupOpen(true);
    }
  };
  return (
    <div className="flex flex-col py-1">
      {label && (
        <label className="block mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          let displaySrc: string | null = null;

          if (typeof value === "string") {
            displaySrc = value;
          } else if (value instanceof File) {
            displaySrc = objectUrl;
          }

          const handleFileChangeInner = async (
            event: React.ChangeEvent<HTMLInputElement>,
          ) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const nameLc = file.name.toLowerCase();
            const hasAllowedExt =
              nameLc.endsWith(".jpeg") ||
              nameLc.endsWith(".jpg") ||
              nameLc.endsWith(".png");
            if (!hasAllowedExt) {
              toast.error("Only .jpeg, .jpg, or .png extensions are allowed.");
              return;
            }

            const { valid } = await validateImageFile(file);
            if (!valid) {
              toast.error("Uploaded file is corrupted or not a valid image.");
              return;
            }

            if (file.size < 10 * 1024 || file.size > maxSize) {
              toast.error("File size must be between 10 KB and 350 KB.");
              return;
            }

            onChange(file);
            setIsPopupOpen(false);
          };

          const handleAvatarSelectInner = async (avatar: {
            id: string;
            url: string;
          }) => {
            try {
              const response = await fetch(avatar.url);
              const blob = await response.blob();
              const file = new File([blob], `avatar-${avatar.id}.png`, {
                type: blob.type,
              });
              onChange(file);
              setIsPopupOpen(false);
            } catch (error) {
              console.error("Failed to convert avatar to file:", error);
              toast.error("Failed to select avatar. Please try again.");
            }
          };

          return (
            <>
              <div className="relative inline-block">
                <div
                  className={`w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${
                    allowUpload ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={handleImageClick}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <LoaderComponent />
                    </div>
                  ) : displaySrc ? (
                    <img
                      src={displaySrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>

                {allowUpload && (
                  <button
                    type="button"
                    onClick={handleOpenPopup}
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
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  onChange={handleFileChangeInner}
                  className="hidden"
                />
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}

              {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsPopupOpen(false)}
                  />
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl z-10">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                      Choose Your Profile Picture
                    </h3>

                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => handleAvatarSelectInner(avatar)}
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

                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full py-2 text-sm font-medium text-teal-700 hover:text-teal-800 border border-teal-300 hover:border-teal-500 rounded-lg transition"
                    >
                      Upload from Device
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

export default ImageUploaderField;
