import { SubAdminRoles } from "@/dummy_data/admin/manageSubAdmin";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/utils/validate";
import { useForm } from "react-hook-form";
import type { AddSubAdminForm } from "./types";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * `AddSubAdmin` is a page component for adding a new sub-admin user.
 * It provides a form with fields for name, email, phone number, role, and a profile image.
 * The form includes validation for each field. On successful submission, it displays a success toast.
 * @returns {JSX.Element} The rendered page component.
 */
export default function AddSubAdmin() {
  const methods = useForm<AddSubAdminForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      role: "",
    },
  });

  const navigate = useNavigate();

  const handleSubmit = (data: AddSubAdminForm) => {
    console.log("data", data);
    toast.success("Sub Admin Added Successfully");
    navigate(absoluteUrls.admin.home.manage_sub_admin);
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Add Sub-Admin</p>
        <Button
          variant="solid"
          className=""
          onClick={() =>
            navigate(`${absoluteUrls.admin.home.manage_sub_admin}`)
          }
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <FormContainer methods={methods} onSubmit={handleSubmit}>
          <div className="mb-6 mt-2 w-fit">
            <ImageUploaderField label="Profile Image" name="profileImage" />
          </div>
          <div className="grid md:flex gap-4 w-full">
            <div className="gap-4 w-1/2 space-y-2">
              <InputField
                name="name"
                label="Full Name"
                type="text"
                placeholder="Enter Name"
                required
                alphabetOnly
                rules={{ validate: (v: string) => validateName(v) }}
              />
              <PhoneInputField
                name="phoneNumber"
                label="Mobile Number"
                required
              />
            </div>
            <div className="gap-4 w-1/2 space-y-2">
              <InputField
                name="email"
                label="Email Address"
                type="text"
                required
                rules={validateEmailRules}
              />

              <SelectField
                name="role"
                label="Select Roles"
                placeholder="Select Roles"
                options={SubAdminRoles}
                required
              />
            </div>
          </div>
          <div className="my-4 flex justify-end">
            <Button
              type="submit"
              className="w-fit bg-gradient-to-r bg-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Save
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
