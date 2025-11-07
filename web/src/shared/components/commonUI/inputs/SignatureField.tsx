import { icons } from "@/config/icons";
import React, { useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
  type ControllerRenderProps,
} from "react-hook-form";
import { toast } from "react-toastify";

interface SignatureUploadProps {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  minSize?: number; // 👈 Added minSize prop
  maxSize?: number;
  containerClassName?: string;
}

export const SignatureUpload = ({
  name,
  label = "Technician Signature",
  required = false,
  accept = ".png,.jpg,.jpeg",
  minSize = 2 * 1024, // 👈 2 KB minimum (prevents blank/corrupt files)
  maxSize = 350 * 1024, // 350 KB default
  containerClassName = "flex flex-col py-1 w-full",
}: SignatureUploadProps) => {
  const { control } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // ✅ Helper: Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  // ✅ Allowed extensions
  const getAcceptExtensions = (): string[] => {
    return accept
      .split(",")
      .map((ext) => ext.trim().replace(/^\.?/, "").toLowerCase());
  };

  // ✅ Display types like “PNG, JPG”
  const formatAllowedTypes = (): string => {
    const types = getAcceptExtensions().map((ext) => ext.toUpperCase());
    return types.join(", ");
  };

  // ✅ Check extension
  const isFileTypeAllowed = (file: File): boolean => {
    const allowedExts = getAcceptExtensions();
    return allowedExts.some((ext) =>
      file.name.toLowerCase().endsWith(`.${ext}`)
    );
  };

  // ✅ Handle file change with full validation
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setFileName(null);
    setFileUrl(null);

    // 1️⃣ Extension validation
    if (!isFileTypeAllowed(file)) {
      const msg = `Only ${formatAllowedTypes()} files are allowed.`;
      setFileError(msg);
      toast.error(msg);
      field.onChange(null);
      return;
    }

    // 2️⃣ Size validation
    if (file.size < minSize) {
      const msg = `File must be at least ${(minSize / 1024).toFixed(0)} KB.`;
      setFileError(msg);
      toast.error(msg);
      field.onChange(null);
      return;
    }

    if (file.size > maxSize) {
      const msg = `File must be under ${(maxSize / 1024).toFixed(0)} KB.`;
      setFileError(msg);
      toast.error(msg);
      field.onChange(null);
      return;
    }

    // 3️⃣ File signature validation
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
      const isJpeg = await validateJpegSignature(file);
      if (!isJpeg) {
        const msg = "Invalid JPEG file format.";
        setFileError(msg);
        toast.error(msg);
        field.onChange(null);
        return;
      }
    } else if (lowerName.endsWith(".png")) {
      const isPng = await validatePngSignature(file);
      if (!isPng) {
        const msg = "Invalid PNG file format.";
        setFileError(msg);
        toast.error(msg);
        field.onChange(null);
        return;
      }
    }

    // ✅ Success — show preview
    const url = URL.createObjectURL(file);
    setFileName(file.name);
    setFileUrl(url);
    field.onChange(file);
  };

  // ✅ Remove file
  const handleRemove = (field: ControllerRenderProps) => {
    field.onChange(null);
    setFileName(null);
    setFileUrl(null);
    setFileError(null);
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = "";
  };

  const validationRules: RegisterOptions = {
    required: required ? `${label} is required` : false,
  };

  return (
    <div className={containerClassName}>
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const displayError = error?.message || fileError;

          return (
            <>
              <div
                className={`relative border-2 border-dashed rounded-md p-4 text-center transition cursor-pointer 
                ${
                  displayError
                    ? "border-red-500"
                    : "border-emerald-700 hover:border-emerald-800"
                } bg-gray-50 dark:bg-gray-800`}
                onClick={() =>
                  !fileName && document.getElementById(name)?.click()
                }
              >
                {!fileUrl ? (
                  <div className="flex flex-row items-center justify-center gap-1 text-emerald-700">
                    <icons.add className="h-6 w-6" />
                    <span className="font-medium">{label}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <img
                      src={fileUrl}
                      alt="Signature Preview"
                      className="max-h-24 border border-emerald-700 rounded-md"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {fileName}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(field)}
                      className="text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input
                  id={name}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => handleChange(e, field)}
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

export default SignatureUpload;
