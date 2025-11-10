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


/**
 * PersonalDetails component renders a form for users to update their personal profile details.
 * Utilizes react-hook-form for form state management and validation.
 * Handles fields for name, email, phone number, and profile image.
 *
 * @component
 */
export default function PersonalDetails() {
  /**
   * React Hook Form methods for managing form state and validation.
   */
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImage: null,
    },
  });

  /**
   * Handles form submission. Currently logs to console on submit.
   * @returns {void}
   */
  const handleSubmit = () => {
    // console.log("Profile Submitted");
    toast.success("Profile Updated Successfully!");
  };
// 
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
