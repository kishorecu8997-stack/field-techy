import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import { BackgroundVerificationFields } from "../BackgroundVerificationFields";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import {
  useUploadClientFile,
  useAppMarkProfileFileUploaded,
} from "@/shared/apiServices/client/clientOpenApiService";
import { type ClientDocumentType } from "@/shared/apiServices/client/clientTypes";
import { useState } from "react";

interface DocumentFormData {
  profileImage: File | string | null;
  governmentId: FileList | null;
  certificate: FileList | null;
}

/**
 * Document upload component for client registration.
 *
 * Allows clients to upload optional documents:
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
  const clientId = searchParams.get("id");

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  const formCtx = useForm<DocumentFormData>({
    defaultValues: {
      profileImage: null,
      governmentId: null,
      certificate: null,
    },
  });

  const { showPopup } = usePopupStore();
  const { clearStore } = useClientRegistrationStore();
  const { updateDocuments } = useClientRegistrationStore();

  const { mutateAsync: markUploadedAsync } = useAppMarkProfileFileUploaded();

  const { mutateAsync: uploadFileAsync } = useUploadClientFile({
    onProgress: (progress: { percentage?: number }) => {
      if (progress.percentage && uploadingDoc) {
        setUploadProgress((prev) => ({
          ...prev,
          [uploadingDoc]: progress.percentage!,
        }));
      }
    },
  });

  const handleUploadProcess = async (
    file: File,
    type: "profilePicture" | "govIdDoc" | "certificateDoc",
  ) => {
    const docKey: ClientDocumentType =
      type === "profilePicture"
        ? "PROFILE_PICTURE"
        : type === "govIdDoc"
          ? "GOVERNMENT_ID"
          : "CERTIFICATE";

    setUploadingDoc(docKey);
    try {
      const uploadResponse = await uploadFileAsync({
        clientId: clientId!,
        file,
        documentType: docKey,
      });

      if (uploadResponse?.fileId) {
        await markUploadedAsync({
          body: {
            fileId: Number(uploadResponse.fileId),
          },
          headers: { authorization: "" },
        });

        // Update local store with the resulting ID if needed
        switch (type) {
          case "profilePicture":
            updateDocuments({ profileImageUrl: uploadResponse.fileId });
            break;
          case "govIdDoc":
            updateDocuments({ governmentIdUrl: uploadResponse.fileId });
            break;
          case "certificateDoc":
            updateDocuments({ certificateUrl: uploadResponse.fileId });
            break;
        }

        toast.success(`${docKey.replace("_", " ")} linked successfully`);
      }
    } catch {
      toast.error(`Error uploading ${type}`);
    } finally {
      setUploadingDoc(null);
    }
  };

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
            navigate(absoluteUrls.client.home.dashboard);
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: DocumentFormData) => {
    if (!clientId) {
      toast.error("Client ID not found. Please restart registration.");
      return;
    }

    // Check if at least one document is selected
    const hasAtLeastOne =
      data.profileImage || data.governmentId || data.certificate;

    if (!hasAtLeastOne) {
      toast.error("Please upload at least one document or click 'Skip'.");
      return;
    }

    // Upload files
    const uploads: Promise<void>[] = [];

    if (data.profileImage && data.profileImage instanceof File) {
      uploads.push(handleUploadProcess(data.profileImage, "profilePicture"));
    }
    if (data.governmentId && data.governmentId.length > 0) {
      uploads.push(handleUploadProcess(data.governmentId[0], "govIdDoc"));
    }
    if (data.certificate && data.certificate.length > 0) {
      uploads.push(handleUploadProcess(data.certificate[0], "certificateDoc"));
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
              navigate(absoluteUrls.client.auth.login);
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
      <div className="shrink-0 p-4 flex mt-8 flex-col gap-2 items-center justify-center bg-transparent ">
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
