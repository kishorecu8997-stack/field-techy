import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import BackgroundVerification from "../BackgroundVerification";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const Documents = () => {
  const formCtx = useForm();

  return (
    <FormContainer methods={formCtx}>
      <div className="flex flex-row justify-center items-center">
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>
      <FileUpload
        name="resume"
        label="Resume/CV"
        required
        accept=".pdf"
        maxPages={5}
        validatePDF={true}
      />
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <BackgroundVerification />
      </div>
    </FormContainer>
  );
};

export default Documents;
