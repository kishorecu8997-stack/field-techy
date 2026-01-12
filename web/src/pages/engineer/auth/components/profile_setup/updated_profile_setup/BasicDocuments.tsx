

import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import BackgroundVerification from "@/pages/engineer/auth/components/profile_setup/BackgroundVerification";
import { useEngineerRegistrationStore } from "@/shared/store/useEngineerRegistrationStore";
import { useEngineerFileUpload } from "@/shared/apiServices/engineer/engineerService";
import { useState } from "react";


interface DocumentFormData {
  profileImage: File | string | null;
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
      governmentId: null,
      certificate: null,
    },
  });

  const { showPopup } = usePopupStore();
  const { clearStore, updateDocuments } = useEngineerRegistrationStore();

  const { mutateAsync: uploadFileAsync } = useEngineerFileUpload(
    engineerId || undefined,
    {
      onSuccess: () => {
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
    }
  );

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
      data.profileImage || data.governmentId || data.certificate;

    if (!hasAtLeastOne) {
      toast.error("Please upload at least one document or click 'Skip'.");
      return;
    }

    // Upload files
    const uploads: Promise<any>[] = [];

    if (data.profileImage && data.profileImage instanceof File) {
      setUploadingDoc("PICTURE");
      uploads.push(
        uploadFileAsync({
          engineerId,
          file: data.profileImage,
          documentType: "PICTURE",
          onUploadProgress: (progress) => {
            if (progress.percentage) {
              setUploadProgress((prev) => ({
                ...prev,
                PICTURE: progress.percentage!,
              }));
            }
          },
        }).then((res) => {
          updateDocuments({ profileImageUrl: res.fileId });
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
        }).then((res) => {
          updateDocuments({ governmentIdUrl: res.fileId });
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
        }).then((res) => {
          updateDocuments({ certificateUrl: res.fileId });
        })
      );
    }

    try {
      await Promise.all(uploads);

      showPopup({
        title: "Documents Uploaded Successfully!",
        body: "Your documents have been uploaded. Proceed to Login?",
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
      {/* header - sticky */}
      <div className="shrink-0 p-4 flex mt-8 flex-col gap-2 items-center justify-center bg-transparent ">
        <h2 className="text-3xl font-bold">Background Verification</h2>
        <h2 className="text-md font-extralight">
          Please upload at least one document for background verification{" "}
          <span className="text-sm text-gray-500">(or skip for now)</span>
        </h2>
      </div>

      {/* body - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* profile image */}
        <div className="flex flex-row justify-center items-center py-1">
          <div className="w-fit">
            <ImageUploaderField name="profileImage" />
          </div>
        </div>

        {/* documents */}
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <BackgroundVerification />

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

      {/* footer - sticky */}
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
            className="w-1/2 bg-linear-to-r mb-8 from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {isUploading ? "Uploading..." : "Save and Continue"}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDocuments;
