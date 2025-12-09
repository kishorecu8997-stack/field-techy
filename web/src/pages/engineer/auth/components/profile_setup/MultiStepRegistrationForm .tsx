import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useEngineerSignup } from "@/shared/apiServices/engineer/engineerService";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { CompleteRegistrationData } from "../types";
import BackgroundVerification from "./BackgroundVerification";
import ProfileSettingPage from "./ProfileSettingPage";
import SetPassword from "./SetPassword";
import { toast } from "react-toastify";

/**
 * Multi-step Registration Form
 * 
 * This component is a multi-step registration form that guides the user through the registration process.
 * It consists of three steps: Profile Setting, Background Verification, and Password Setting.
 * 
 * The form is divided into two parts: the first part (Profile Setting) is where the user sets up their profile information,
 * such as name, email, phone number, address, skills, portfolio, service category, amount, designation, company, and experience.
 * 
 * The second part (Background Verification) is where the user verifies their identity by providing government ID and certificate.
 * 
 * The third part (Password Setting) is where the user sets up their password and confirms it.
 */
const MultiStepRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { mutateAsync: signup, isPending: isSubmitting } = useEngineerSignup({
    onSuccess: () => {
      toast.success("Completed registration successfully");
      navigate("/engineer/auth");
    },
    onError: (error: any) => {
      console.error("Submit error:", error);
      toast.error("Registration failed. Please try again.");
    }
  });

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Step 1: Profile Setup
      profileImage: undefined,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      skills: [],
      portfolio: "",
      amount: "",
      designation: "",
      company: "",
      country: "",
      postalCode: "",
      serviceCategory: "",
      experience: "",
      resume: undefined,

      // Step 2: Background Verification
      governmentId: undefined,
      certificate: undefined,

      // Step 3: Password Create
      password: "",
      confirmPassword: "",

      mobileOTP: "",
      emailOTP: "",
    },
  });

  const { trigger } = methods;

  // Handle step validation & navigation
  const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
    data
  ) => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger([
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "country",
          "postalCode",
          "skills",
          "portfolio",
          "serviceCategory",
          "amount",
          "designation",
          "company",
          "experience",
          "resume",
        ]);
        if (isValid) setCurrentStep(2);
        break;

      case 2:
        setCurrentStep(3);
        break;

      case 3:
        isValid = await trigger(["password", "confirmPassword"]);
        if (isValid) submitCompleteForm(data);
        break;
    }
  };

  const submitCompleteForm = async (data: CompleteRegistrationData) => {
    try {
      await signup(data);
    } catch (error) {
      console.error("Submit error:", error);  
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Step renderer
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
    <FormContainer
      methods={methods}
      onSubmit={handleStepSubmit}
      className="w-full h-full flex flex-col justify-between gap-4"
    >
      {currentStep > 1 && (
        <div>
          <button
            type="button"
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

        <div
          key={currentStep}
          className="flex-1 p-2 relative gap-3 overflow-y-auto max-h-[75vh] w-full justify-items-center"
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
  );
};

export default MultiStepRegistrationForm;
