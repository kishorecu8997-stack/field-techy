import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";

import { BackgroundVerificationFields } from "./BackgroundVerificationFields";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePopupStore } from "@/shared/store/popupStore";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import { ClientAdapter } from "@/shared/apiServices/client/clientAdapter";
import { toast } from "react-toastify";
import { useState } from "react";

export type BackgroundVerificationData = {
  governmentId: string;
  certificate: string;
};

/**
 * Type representing the data structure for the Login form.
 * @typedef {Object} LoginFormData
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 * @property {boolean} rememberMe - Whether to remember the user.
 */
const BackgroundVerification = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { clientId, clearStore } = useClientRegistrationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<BackgroundVerificationData>({
    defaultValues: {
      certificate: "",
      governmentId: "",
    },
  });

  const handleSubmit = async (data: any) => {
    if (!clientId) {
      toast.error("Client ID is missing. Please complete the registration first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { updateDocuments } = useClientRegistrationStore.getState();

      // 1. Upload Government ID
      if (data.governmentId && data.governmentId[0]) {
        const response = await ClientAdapter.uploadFile({
          clientId,
          file: data.governmentId[0],
          documentType: "GOVERNMENT_ID",
        });
        updateDocuments({ governmentIdUrl: response.fileId });
      }

      // 2. Upload Certificate
      if (data.certificate && data.certificate[0]) {
        const response = await ClientAdapter.uploadFile({
          clientId,
          file: data.certificate[0],
          documentType: "CERTIFICATE",
        });
        updateDocuments({ certificateUrl: response.fileId });
      }

      // 3. Show Success Popup -> Redirect to Login
      await showPopup({
        title: "Registration Successful",
        body: "Your profile has been set up successfully. Please proceed to login.",
        actionButtons: [
          {
            label: "Proceed to Login",
            value: true,
            action: (close) => {
              clearStore();
              navigate(absoluteUrls.client.auth.login);
              close(true);
            },
          },
        ],
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload documents.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex items-center justify-center w-lg">
      <div className="flexed absolute top-6 left-6 md:left-[20rem] lg:left-[40rem] z-10">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <div className=" p-10 w-full ">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img src={assetsConfig.logos.companyLogo} alt="logo" className="h-20 w-24" />
          </div>
          <h2 className="text-3xl font-bold">Background Verification</h2>
          <h2 className="text-md font-extralight ">
            Please upload the required documents for background verification.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col  p-2 gap-4"
        >
          {/* TODO: Uncomment when Resume/CV upload API is ready
          Currently hidden until backend endpoint is available for RESUME document type
          <FileUpload
            name="resume"
            label="Resume/CV"
            placeholder="Upload Resume"
            accept='.pdf'
            maxPages={5}
            validatePDF={true}
          />
          */}

          <BackgroundVerificationFields />
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default BackgroundVerification;
