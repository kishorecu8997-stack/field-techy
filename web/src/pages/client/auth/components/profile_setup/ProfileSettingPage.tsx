import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import BackgroundVerification from "@/pages/engineer/auth/components/profile_setup/BackgroundVerification";
import type { ClientData } from "@/shared/apiServices/client/clientAdapter";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import ProfileSetup from "./ProfileSetup";
import SetPassword from "./SetPassword";
import type { CompleteRegistrationData } from "./types";
import { useClientProfileCreate } from "@/shared/apiServices/profiles/client/clientProfileService";

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
  const { role } = useParams<{ role?: string }>();
  const navigate = useNavigate();

  const methods = useForm<CompleteRegistrationData>({
    mode: "onSubmit",
    defaultValues: {
      // Profile Setup
      country: "in",
      profileImage: undefined,
      companyName: "praxio",
      contactPersonName: "karthi",
      email: "karthi001@gmai.com",
      fullName: "karthi",
      phoneNumber: "8220932517",
      businessType: "",
      industry: "praxio",
      address: "5th avenue",
      state: "1",
      city: "1",
      vat: "123456789",
      vatRegistrationNumber: "wewe",

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
  const { showPopup } = usePopupStore();

  const handleStepSubmit: SubmitHandler<CompleteRegistrationData> = async (
    data
  ) => {
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


  const { mutate: signupClient, isPending } = useClientProfileCreate({
    onSuccess: (data) => {
      console.log("Signup success:", data);
      setIsSubmitting(false);
      // setAccessPopup(true);
      navigate(absoluteUrls.client.auth.login);
    },
    onError: (error) => {
      console.error("Signup error:", error);
      setIsSubmitting(false);
    },
  });

  const submitCompleteForm = async (data: ClientData) => {
    setIsSubmitting(true);
    let clientData: ClientData = {
      companyName: data.companyName,
      contactPersonName: data.contactPersonName,
      phoneNumber: data.phoneNumber,
      businessType: data.businessType,
      industry: data.industry,
      address: data.address,
      state: data.state,
      city: data.city,
      vatRegistrationNumber: data.vatRegistrationNumber,
      taxDocumentVat: data.vat,
      password: data.password,
      email: data.email,
      certificationQualificationsDocument: "",
      governmentIdProofDocument: "",
      profilePicture: "",
      enableNotifications: data.enableNotifications,
      isApproved: true,
      clientType: data.clientType,
      country: data.country,
      postalCode: data.postalCode,
    };

    await showPopup({
      title: "Client Signup",
      body: "Are you sure you want to signup client",
      actionButtons: [
        {
          label: "Yes",
          variant: "primary",
          value: "yes",
          action(close) {
            console.log("Yes clicked");
            signupClient(clientData);
            close(true);
          },
        },
        {
          label: "No",
          variant: "secondary",
          value: "no",
          action: (close) => {
            console.log("No clicked");
            close(true);
          },
        },
      ],
    });
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
                ? isPending || isSubmitting
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

export default CorporateMultiStepRegistration;
