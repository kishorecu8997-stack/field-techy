import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { ImageUploadField } from "@/shared/components/commonUI/inputs/ImageUploaderField";
import { useForm } from "react-hook-form";
import ProfileSetup from "./ProfileSetup";
import logo from "@/pages/assets/logo.png";
import { Button } from "@/shared/components/Buttons";
import { useNavigate } from "react-router-dom";
import { urls } from "@/config/urls";
import type { ProfileSetupData } from "../types";


/**
 * Profile Setting page component for completing user profile information.
 * Provides form fields for user details including profile image, personal information,
 * and professional details. Handles form submission and navigation to background verification.
 * 
 * @component
 * @example
 * return (
 *   <ProfileSettingPage />
 * )
 * 
 * @returns {JSX.Element} The rendered Profile Setting page component
 */
const ProfileSettingPage = () => {
  const navigate = useNavigate();
  const formCtx = useForm<ProfileSetupData>({
    mode: 'onChange',
    defaultValues: {
      address: "",
      amount: "",
      company: "",
      designation: "",
      email: "",
      experience: "",
      location: "",
      name: "",
      portfolio: "",
      resume: "",
      tags: [],
    },
  });

  const handleSubmit = (data: ProfileSetupData) => {
    console.log(data, "data from Login Form");
    navigate(urls.auth.background_verification);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <>
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
      <div className="absolute  w-full flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <img src={logo} alt="profile" className="w-20 h-20" />
        </div>
        <FormContainer
          methods={formCtx}
          onSubmit={handleSubmit}
          className="flex w-full flex-col justify-center items-center"
        >
          <div className="p-6 relative gap-3 overflow-auto h-[80vh] w-full justify-items-center">
            <div className="p-2 flex flex-col gap-2 items-center justify-center">
              <h2 className="text-3xl font-bold">Profile Setup</h2>
              <p className="text-md text-center text-gray-600 mb-6 px-3">
                Complete your profile to unlock opportunities.
              </p>
            </div>
            <div className="flex flex-row justify-center items-center">
              <div className=" w-fit ">
                <ImageUploadField name="profileImage" />
              </div>
            </div>
            <div className="flex justify-center w-full">
              <ProfileSetup />
            </div>
          </div>
          <div className="flex  justify-center items-center w-full">
            <Button
              type="submit"
              className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      </div>
    </>
  );
};

export default ProfileSettingPage;
