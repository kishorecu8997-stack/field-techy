// components/MultiStepRegistrationForm.tsx
import { assetsConfig } from "@/assets";

import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BackgroundVerification from "./BackgroundVerification";
import ProfileSettingPage from "./ProfileSettingPage";
import SetPassword from "./SetPassword";

// Types (without Zod)
export type CompleteRegistrationData = {
  // Profile Setup
  profileImage?: File;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phone: string;
  address: string;
  tags: string[];
  skills: string[];
  portfolio?: string;
  amount: string;
  designation: string;
  company: string;
  location: string;
  country: string;
  postalCode: string;
  experience: string;
  resume?: File;

  // Background Verification
  governmentId?: File;
  certificate?: File;

  // Set Password
  password: string;
  confirmPassword: string;

  mobileOTP?: string;
  emailOTP?: string;
};

/**
 * A multi-step registration form component that guides users through
 * profile setup, background verification, and password creation.
 *
 * This component manages the overall flow of the registration process,
 * handling step navigation, form submission, and integration with
 * `react-hook-form` for state management and validation across steps.
 * It orchestrates the display of `ProfileSettingPage`, `BackgroundVerification`,
 * and `SetPassword` components.
 *
 * Upon successful completion of all steps, it displays a success popup
 * and navigates the user to the sign-in page.
 *
 */
const MultiStepRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Profile Setup
      profileImage: undefined,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phone: "",
      address: "",
      tags: [],
      skills: [],
      portfolio: "",
      amount: "",
      designation: "",
      company: "",
      location: "",
      country: "",
      postalCode: "",
      experience: "",
      resume: undefined,

      // Background Verification
      governmentId: undefined,
      certificate: undefined,

      // Set Password
      password: "",
      confirmPassword: "",

      mobileOTP: "",
      emailOTP: "",
    },
  });

  const { trigger } = methods;

  const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
    data
  ) => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        // Trigger validation for step 1 fields
        isValid = await trigger([
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "phone",
          "address",
          "country",
          "postalCode",
          "designation",
          "company",
          "location",
          "experience",
        ]);
        if (isValid) {
          setCurrentStep(2);
        }
        break;

      case 2:
        isValid = await trigger(["governmentId", "certificate"]);
        if (isValid) {
          setCurrentStep(3);
        }
        break;

      case 3:
        isValid = await trigger(["password", "confirmPassword"]);
        if (isValid) {
          await submitCompleteForm(data);
        }
        break;
    }
  };

  const submitCompleteForm = async (data: CompleteRegistrationData) => {
    setIsSubmitting(true);
    try {
      // 🔥 MOCK API CALL (replace with real fetch when backend is ready)
      console.log("Submitting registration data:", data);

      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));

      // Simulate success
      navigate("/engineer/auth");
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSettingPage />;
      case 2:
        return <BackgroundVerification />;
      case 3:
        return <SetPassword />;
      default:
        return <ProfileSettingPage />;
    }
  };

  return (
    <>
      <FormContainer
        methods={methods}
        onSubmit={handleStepSubmit}
        className="w-full"
      >
        {currentStep > 1 && (
          <div>
            <button
              type="button" // Prevents form submission
              onClick={goToPreviousStep}
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
        )}

        <div>
          <div className="flex items-center justify-center">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="profile"
              className="w-20 h-20"
            />
          </div>

          {/* ✅ FIXED: Added key={currentStep} to force re-render on step change */}
          <div
            key={currentStep}
            className="p-2 relative gap-3 overflow-auto max-h-[75vh] w-full justify-items-center"
          >
            {renderStep()}
          </div>

          <div className="flex justify-center items-center w-full p-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              {currentStep === 3
                ? isSubmitting
                  ? "Submitting..."
                  : "Complete Registration"
                : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </>
  );
};

export default MultiStepRegistrationForm;