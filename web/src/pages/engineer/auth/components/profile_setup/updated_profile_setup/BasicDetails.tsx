import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useForm } from "react-hook-form";
import ProfileSetup from "../ProfileSetup";
import type { basicDetails } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * A component that represents the first step of the user registration process, focusing on profile setup.
 *
 * This page serves as a container for the initial profile configuration, including
 * a header, a profile image uploader, and the main `ProfileSetup` form which
 * collects basic user details. It's designed to be displayed as the first view
 */
const BasicDetails = () => {
  const formCtx = useForm<basicDetails>({
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
      className="flex flex-col h-screen w-full"
    >
      <div className="shrink-0 p-2 flex flex-col gap-2 items-center justify-center  bg-white sticky top-0 z-10">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 mb-4 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>

      <div className="flex w-full overflow-y-auto mx-auto justify-center flex-grow">
        <div className="flex-grow p-2 max-w-md">
          <ProfileSetup />
        </div>
      </div>

      <div className="flex shrink-0 w-full overflow-y-auto mx-auto justify-center flex-grow sticky bottom-0 z-10">
        <div className="flex-grow  max-w-md">
          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default BasicDetails;
