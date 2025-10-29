import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

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
  return (
    <div className="flex items-center justify-center w-lg">
      <div className="p-10 w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Background Verification</h2>
          <h2 className="text-md font-extralight ">
            Please upload the required documents for background verification.
          </h2>
        </div>
        {/* <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col  p-2 gap-4"
        > */}
        <FileUpload
          name="governmentId"
          label="Government ID"
          placeholder="Government ID"
          required
        />
        <FileUpload
          name="certificate"
          label="Certificate"
          placeholder="Certificate"
          required
        />
        {/* </FormContainer> */}
      </div>
    </div>
  );
};

export default BackgroundVerification;
