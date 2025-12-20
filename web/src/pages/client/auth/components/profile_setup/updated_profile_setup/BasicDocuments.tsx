import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";
import BackgroundVerification from "@/pages/engineer/auth/components/profile_setup/BackgroundVerification";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const BasicDocuments = () => {
  const navigate = useNavigate();
  const formCtx = useForm({
    defaultValues: {
      profileImage: null,
      resume: null,
      governmentId: null,
      certificate: null,
    },
  });
  const { showPopup } = usePopupStore();

  const handleSubmit = async (data: any) => {
    console.log(data, "data from Documents Form");
    await showPopup({
      title: "Document Submission Confirmation",
      body: "Are you sure you want to submit the documents?",
      actionButtons: [
        {
          label: "Close",
          value: false,
          variant: "outline",
          action: (close) => {
            console.log("Cancelled");
            close(false);
          },
        },
        {
          label: "Submit",
          value: true,
          action: (close) => {
            console.log("Confirmed");
            toast.success("Documents submitted successfully!");
            navigate(absoluteUrls.client.home.dashboard);
            close(true);
          },
        },
      ],
    });
  };

  return (
    <FormContainer
      methods={formCtx}
      onSubmit={handleSubmit}
      className="flex flex-col h-screen w-full"
    >
      {/* header - sticky */}
      <div className="shrink-0 p-4 flex flex-col gap-2 items-center justify-center bg-white ">
        <h2 className="text-3xl font-bold">Background Verification</h2>
        <h2 className="text-md font-extralight">
          Please upload the required documents for background verification.
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
        {/* resume */}
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <FileUpload
              name="resume"
              label="Resume/CV"
              required
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          <BackgroundVerification />
        </div>
      </div>

      {/* footer - sticky */}
      <div className="shrink-0 p-4 bg-white  flex justify-center">
        <div className="w-full max-w-md">
          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDocuments;
