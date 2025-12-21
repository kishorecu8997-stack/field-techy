import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BackgroundVerification from "../BackgroundVerification";
import { usePopupStore } from "@/shared/store/popupStore";
import { toast } from "react-toastify";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const Documents = () => {
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
      body: "Are you sure you want to sign up with the provided details?",
      actionButtons: [
        {
          label: "Yes",
          value: true,
          action: (close) => {
            console.log("Confirmed");
            toast.success("Documents submitted successfully!");
            navigate(absoluteUrls.engineer.home.dashboard);
            close(true);
          },
        },
        {
          label: "No",
          value: false,
          action: (close) => {
            console.log("Cancelled");
            close(false);
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
      <div className="shrink-0 p-2 flex flex-col gap-2 items-center justify-center  bg-white sticky top-0 z-10">
        <h2 className="text-3xl font-bold">Background Verification</h2>
        <h2 className="text-md font-extralight">
          Please upload the required documents for background verification.
        </h2>
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
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
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <BackgroundVerification />
      </div>
      <div className="flex shrink-0 w-full overflow-y-auto mx-auto justify-center flex-grow sticky bottom-2 z-10">
        <div className="flex-grow  max-w-md">
          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default Documents;
