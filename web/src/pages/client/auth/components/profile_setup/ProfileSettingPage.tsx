import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import BackgroundVerification from "@/pages/engineer/auth/components/profile_setup/BackgroundVerification";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import ProfileSetup from "./ProfileSetup";
import type { CompleteRegistrationData } from "./types";
import SetPassword from "@/pages/engineer/auth/components/profile_setup/SetPassword";

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
const CorporateMultiStepRegistration = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [accessPopup, setAccessPopup] = useState<boolean>(false);
  const { role } = useParams<{ role?: string }>();
  const navigate=useNavigate()

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Profile Setup
      profileImage: undefined,
      companyName: "",
      contactPersonName: "",
      phoneNumber: "",
      businessType: "",
      industry: "",
      address: "",
      state: "",
      city: "",
      vat: "",
      vatRegistrationNumber: "",

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

  /**
   * handleStepSubmit
   *
   * Submission handler used by the `FormContainer`. Validates the current
   * step's fields (using react-hook-form's `trigger`) and advances the
   * step when validation succeeds. On the final step it calls
   * `submitCompleteForm` to perform the final submission.
   *
   * @param {CompleteRegistrationData} data - The collected form data across all steps
   */
  const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
    data
  ) => {
    console.log("vall");
    let isValid = false;

    switch (currentStep) {
      case 1:
        // Trigger validation for step 1 fields
        isValid = await trigger([
          "companyName",
          "contactPersonName",
          "phoneNumber",
          "businessType",
          "industry",
          "address",
          "state",
          "city",
          "vat",
          "vatRegistrationNumber",
        ]);
        if (isValid) {
          setCurrentStep(2);
        }
        break;

      case 2:
        isValid = await trigger([]);
        if (isValid) {
          setCurrentStep(3);
        }
        break;
      case 3:
        isValid = await trigger(["governmentId", "certificate"]);
        if (isValid) {
          setCurrentStep(4);
        }
        break;

      case 4:
        isValid = await trigger(["password", "confirmPassword"]);
        if (isValid) {
          await submitCompleteForm(data);
        }
        break;
    }
  };

  /**
   * submitCompleteForm
   *
   * Final submission routine called when the user completes the last step.
   * This toggles the `isSubmitting` state, performs the network call (here
   * simulated), and shows the success popup on completion.
   *
   * @param {CompleteRegistrationData} data - The fully collected registration data
   */
  const submitCompleteForm = async (data: CompleteRegistrationData) => {
    
    setIsSubmitting(true);
    try {
      // MOCK API CALL (replace with real fetch when backend is ready)
      console.log("Submitting registration data:", data);

      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));
      setAccessPopup(true);

      // Simulate success
       navigate(absoluteUrls.client.auth.login);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * goToPreviousStep
   *
   * Move the flow back one step if possible. Used by the back button in the UI.
   */
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * renderStep
   *
   * Returns the JSX for the currently active step of the registration flow.
   * Centralizes which step component should be displayed for the `currentStep` value.
   *
   * @returns {JSX.Element} The step component to render
   */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSetup role={role} />;
      case 2:
        return <PaymentMethod />;
      case 3:
        return <BackgroundVerification />;
      case 4:
        return <SetPassword />;
      default:
        return <ProfileSetup />;
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
          <div className="flexed absolute top-6 left-6 md:left-[20rem] lg:left-[40rem] z-10">
            <div
              onClick={goToPreviousStep}
              className="p-2 rounded-full cursor-pointer hover:bg-teal-700 text-gray-700 hover:text-white bg-white shadow-md transition-colors"
              aria-label="Go back"
            >
              <FaAngleLeft className="text-xl" />
            </div>
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
            className="relative overflow-auto p-0 mx-auto max-h-[75vh] justify-items-center"
          >
            {renderStep()}
          </div>

          <div className="flex justify-center items-center w-full p-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-[30rem] bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              {currentStep === 4
                ? isSubmitting
                  ? "Submitting..."
                  : "Complete Registration"
                : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>  
      {/* Allow access popup */}
      <AllowAccessPopup accessPopup={accessPopup} setAccessPopup={setAccessPopup} />    
    </>
  );
};

export default CorporateMultiStepRegistration;
