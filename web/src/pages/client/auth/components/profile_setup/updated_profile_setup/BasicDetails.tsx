import SetPassword from "@/pages/engineer/auth/components/profile_setup/SetPassword";
import PaymentMethod from "../PaymentMethod";
import BasicDetailsFields from "./BasicDetailsFields";
import { usePopupStore } from "@/shared/store/popupStore";
import { useForm } from "react-hook-form";
import type { basicDetails } from "@/pages/engineer/auth/components/profile_setup/updated_profile_setup/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const BasicDetails = () => {
  const navigate = useNavigate();
  const formCtx = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phone: "",
      address: "",
      country: "",
      postalCode: "",
      skills: [],
      portfolio: "",
      amount: "",
      designation: "",
      company: "",
      location: "",
      experience: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { showPopup } = usePopupStore();

  const handleSubmit = async (data: basicDetails) => {
    await showPopup({
      title: "Sign Up",
      body: "Are you sure you want to sign up with the provided details?",
      actionButtons: [
        {
          label: "Yes",
          value: true,
          action: (close) => {
            console.log("Confirmed");
            toast.success("Profile details submitted successfully!");
            navigate(absoluteUrls.client.auth.documents);
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
      className="flex flex-col h-screen w-full overflow-hidden"
    >
      <div className="flex-shrink-0 p-4 flex flex-col gap-2 items-center justify-center  bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 dark:text-gray-400 px-3">
          Complete your profile to unlock sss opportunities.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1 max-w-2xl mx-auto">
          <BasicDetailsFields />
          <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
            <div className="mt-2 dark:text-neutral-200">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
            </div>
            <PaymentMethod isHeader={false} />
          </div>
          <SetPassword />
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-1 w-full max-w-md mx-auto">
          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
