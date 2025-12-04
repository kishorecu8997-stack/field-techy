import { validateName } from "@/pages/engineer/user_profile/Validate";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import { useForm } from "react-hook-form";
import type { ProfileFormData } from "./types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * `PersonalDetails` is a component that renders a form for updating a user's personal information.
 * It includes fields for name, email, phone number, and a profile image.
 * The component uses `react-hook-form` for state management and validation.
 *
 * **Note:** This component currently initializes with empty default values. For a real-world
 * application, it should fetch the current user's data and populate the form with it.
 *
 * @returns {JSX.Element} The rendered personal details form.
 */
export default function PersonalDetails() {
  const navigate = useNavigate();
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      name: "Kevin Smith",
      email: "kevinsmith@gmail.com",
      phoneNumber: "",
      profileImage: null,
    },
  });

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: ProfileFormData) => {
    console.log("data :", data);
    await showPopup({
      title: "Update Profile",
      body: "Are you sure you want to update this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action: async (close: any) => {
            console.log("Deleting job:", close);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Profile updated successfully!");
            navigate(absoluteUrls.admin.home.dashboard);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = () => {
    handleSaveConfirmation(methods.getValues());
  };

  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-6 px-2 pb-4 w-full"
      >
        <div className="mb-6 mt-2 w-fit">
          <ImageUploaderField label="Profile Image" name="profileImage" />
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <InputField
              name="name"
              label="Name"
              type="text"
              placeholder="Enter Name"
              required
              rules={{ validate: (v: string) => validateName(v) }}
            />
          </div>

          <div className="flex-1">
            <InputField
              name="email"
              label="Email Address"
              type="text"
              required
              rules={validateEmailRules}
            />
          </div>

          <div className="flex-1">
            <PhoneInputField name="phone" label="Mobile Number" required />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}
