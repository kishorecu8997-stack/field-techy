import { SubAdminRoles, userList } from "@/dummy_data/admin/manageSubAdmin";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import ImageUploaderField from "@/shared/components/commonUI/inputs/ImageUploaderField";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/utils/validate";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { AddSubAdminForm } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * `EditSubAdmin` is a page component for editing an existing sub-admin user.
 * It provides a form pre-filled with the sub-admin's current data, including fields
 * for name, email, phone number, role, and profile image.
 * The form includes validation for each field. On successful submission, it displays a success toast.
 * @returns {JSX.Element} The rendered page component.
 */
export default function EditSubAdmin() {
  const { id } = useParams<{ id: string }>();

  // Find the category by ID (replace with real API call if needed)
  const subAdmin = userList.find((user) => user.id.toString() === id);

  const methods = useForm<AddSubAdminForm>({
    defaultValues: {
      name: subAdmin?.name || "",
      email: subAdmin?.email || "",
      phoneNumber: subAdmin?.phoneNumber || "",
      role: subAdmin?.roleName || "",
    },
  });

  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: AddSubAdminForm) => {
    await showPopup({
      title: "Update Sub-Admin",
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
          action: async (close) => {
            console.log("data :", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Sub-Admin updated successfully!");
            navigate(absoluteUrls.admin.home.manage_sub_admin);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  const handleSubmit = (data: AddSubAdminForm) => {
    handleSaveConfirmation(data);
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Edit Sub-Admin</p>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(absoluteUrls.admin.home.manage_sub_admin)}
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
                allowedCharacters="string"
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
