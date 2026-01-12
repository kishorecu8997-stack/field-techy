

import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { BackgroundVerificationFields } from "@/pages/engineer/auth/components/profile_setup/BackgroundVerificationFields";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { useEngineerFileUpload } from "@/shared/apiServices/engineer/engineerService";
import type { FileUploadResponse } from "@/shared/apiServices/engineer/engineerTypes";
import { useState } from "react";

interface DocumentFormData {
  profileImage: File | string | null;
  resume: FileList | null;
  governmentId: FileList | null;
  certificate: FileList | null;
}

/**
 * Document upload component for engineer registration.
 *
 * Allows engineers to upload optional documents:
 * - Profile image
 * - Government ID
 * - Certificates
 *
 * Users can either:
 * 1. Upload at least ONE document and save
 * 2. Skip and complete later
 */
const BasicDocuments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const engineerId = searchParams.get("id");

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const formCtx = useForm<DocumentFormData>({
    defaultValues: {
      profileImage: null,
      resume: null,
      governmentId: null,
      certificate: null,
    },
  });

  const { showPopup } = usePopupStore();
  const { clearStore, updateDocuments } = useEngineerRegistrationStore();
  
  const { mutateAsync: uploadFileAsync } = useEngineerFileUpload({
    onSuccess: (data, variables) => {
      // Map document type to store key
      switch (variables.documentType) {
        case "PROFILE_PICTURE":
          updateDocuments({ profileImageUrl: data.fileId });
          break;
        case "RESUME":
          updateDocuments({ resumeUrl: data.fileId });
          break;
        case "GOVERNMENT_ID":
          updateDocuments({ governmentIdUrl: data.fileId });
          break;
        case "CERTIFICATE":
          updateDocuments({ certificateUrl: data.fileId });
          break;
      }

      setUploadingDoc(null);
      toast.success("File uploaded successfully!");
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setUploadingDoc(null);
      toast.error("Failed to upload file");
    },
    onProgress: (progress) => {
      setUploadProgress((prev) => ({
        ...prev,
        [uploadingDoc!]: progress.percentage!,
      }));
    },
  });

  const handleSkip = () => {
    showPopup({
      title: "Skip Document Upload?",
      body: "You can upload documents later from your profile. Continue to dashboard?",
      actionButtons: [
        {
          label: "Cancel",
          value: false,
          variant: "outline",
          action: (close) => close(false),
        },
        {
          label: "Skip",
          value: true,
          action: (close) => {
            clearStore();
            navigate(absoluteUrls.engineer.home.dashboard);
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: DocumentFormData) => {
    if (!engineerId) {
      toast.error("Engineer ID not found. Please restart registration.");
      return;
    }

    // Check if at least one document is selected
    const hasAtLeastOne =
      data.profileImage || data.resume || data.governmentId || data.certificate;

    if (!hasAtLeastOne) {
      toast.error("Please upload at least one document or click 'Skip'.");
      return;
    }

    // Upload files
    const uploads: Promise<FileUploadResponse>[] = [];

    if (data.profileImage && data.profileImage instanceof File) {
      setUploadingDoc("PROFILE_PICTURE");
      uploads.push(
        uploadFileAsync({
          engineerId,
          file: data.profileImage,
          documentType: "PROFILE_PICTURE",
          onUploadProgress: (progress) => {
            if (progress.percentage) {
              setUploadProgress((prev) => ({
                ...prev,
                PROFILE_PICTURE: progress.percentage!,
              }));
            }
          },
        })
      );
    }

    if (data.governmentId && data.governmentId.length > 0) {
      setUploadingDoc("GOVERNMENT_ID");
      uploads.push(
        uploadFileAsync({
          engineerId,
          file: data.governmentId[0],
          documentType: "GOVERNMENT_ID",
          onUploadProgress: (progress) => {
            if (progress.percentage) {
              setUploadProgress((prev) => ({
                ...prev,
                GOVERNMENT_ID: progress.percentage!,
              }));
            }
          },
        })
      );
    }

    if (data.resume && data.resume.length > 0) {
      setUploadingDoc("RESUME");
      uploads.push(
        uploadFileAsync({
          engineerId,
          file: data.resume[0],
          documentType: "RESUME",
          onUploadProgress: (progress) => {
            if (progress.percentage) {
              setUploadProgress((prev) => ({
                ...prev,
                RESUME: progress.percentage!,
              }));
            }
          },
        })
      );
    }

    if (data.certificate && data.certificate.length > 0) {
      setUploadingDoc("CERTIFICATE");
      uploads.push(
        uploadFileAsync({
          engineerId,
          file: data.certificate[0],
          documentType: "CERTIFICATE",
          onUploadProgress: (progress) => {
            if (progress.percentage) {
              setUploadProgress((prev) => ({
                ...prev,
                CERTIFICATE: progress.percentage!,
              }));
            }
          },
        })
      );
    }

    try {
      await Promise.all(uploads);

      showPopup({
        title: "Documents Uploaded Successfully!",
        body: "Your documents have been uploaded. Continue to Login?",
        actionButtons: [
          {
            label: "Proceed to Login",
            value: true,
            action: (close) => {
              clearStore();
              toast.success("Registration completed successfully!");
              navigate(absoluteUrls.engineer.auth.login);
              close(true);
            },
          },
        ],
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Some documents failed to upload. Please try again.");
    }
  };

  const isUploading = uploadingDoc !== null;

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-screen w-full"
    >
      <div className="shrink-0 p-4 flex mt-8 flex-col gap-2 items-center justify-center bg-white ">
        <h2 className="text-3xl font-bold">Background Verification</h2>
        <h2 className="text-md font-extralight">
          Please upload at least one document for background verification{" "}
          <span className="text-sm text-gray-500">(or skip for now)</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-row justify-center items-center py-1">
          <div className="w-fit">
            <ImageUploaderField name="profileImage" />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <BackgroundVerificationFields />
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">
                  Uploading {uploadingDoc?.replace("_", " ")}...
                </p>
                {uploadProgress[uploadingDoc] && (
                  <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress[uploadingDoc]}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0 p-4 mb-8 bg-white flex justify-center gap-3">
        <div className="w-full max-w-md flex gap-3">
          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            disabled={isUploading}
            className="w-1/2 flex-1"
          >
            Skip for Now
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="w-1/2 bg-gradient-to-r mb-8 from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {isUploading ? "Uploading..." : "Save and Continue"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDocuments;
