import { urls } from "@/config/urls";
import logo from "@/pages/assets/logo.png";
import { Button } from "@/shared/components/Buttons";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const methods = useForm<BackgroundVerificationData>({
    defaultValues: {
      certificate: "",
      governmentId: "",
    },
  });

  const handleSubmit = (data: BackgroundVerificationData) => {
    console.log(data, "data from Login Form");
    navigate(urls.auth.set_password);
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
            <img src={logo} alt="logo" className="h-20 w-24" />
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
          <FileUpload name="governmentId" label="Government ID" placeholder="Government ID" required/>
          <FileUpload name="certificate" label="Certificate" placeholder="Certificate" required/>
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
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
