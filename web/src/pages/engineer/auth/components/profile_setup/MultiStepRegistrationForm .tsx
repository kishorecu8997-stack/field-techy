import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePostData } from "@/shared/hooks/apiHooks/usePostData";
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
 */
const MultiStepRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { mutate } = usePostData<CompleteRegistrationData>({
    url: "/e/api/v1/eng/signup",
    urlType: "prod",
    onSuccess: () => {
      toast.success("Completed registration successfully");
      navigate("/engineer/auth");
    },
  });

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Step 1: Profile Setup
      profileImage: undefined,
      firstName: "testing",
      lastName: "example",
      email: "",
      phone: "+91 8220932517",
      address: "123 Main Street, City, State 12345",
      skills: ["HTML"],
      portfolio: "https://johndoe.dev",
      amount: "50",
      designation: "Developer",
      company: "Labs",
      country: "",
      postalCode: "638701",
      serviceCategory: "Web Development",
      experience: "6",
      resume: undefined,

      // Step 2: Background Verification
      governmentId: undefined,
      certificate: undefined,

      // Step 3: Password Create
      password: "P@ssw0rd",
      confirmPassword: "P@ssw0rd",

      mobileOTP: "1234",
      emailOTP: "1234",
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
    setIsSubmitting(true);

    try {
      // 1️⃣ Create nested object for all non-file data
      const engineerPayload = {
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
        fullName: `${data.firstName} ${data.lastName}`,
        address: data.address,
        jobSkills: data.skills,
        portfolioLink: data.portfolio ?? "",
        serviceCategory: data.serviceCategory ?? "",
        budget: "",
        experienceYears: data.experience ?? "",
        designation: data.designation ?? "",
        company: data.company ?? "",
        postalCode: data.postalCode ?? "",
        country: data.country ?? "",
        resume: data.resume,
        rate: "",
        experiences: [],
        governmentIdProofDocument: data.governmentId,
        certificateQualificationsDocument: data.certificate,
        educations: [],
        tools: [],
        preferedWorkType: "",
        enableNotifications: false,
        profilePicture: "",
        isApproved: false,
        location: "",
        averageRating: 0,
      };

      await mutate(engineerPayload);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
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
