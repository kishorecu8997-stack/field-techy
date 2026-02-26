import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField, PasswordInput } from "@/shared/components/commonUI/inputs";
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
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAdminCreateSubAdmin,
  type AdminCreateSubAdminBody,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { validatePassword } from "@/shared/libs/utils";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";

/**
 * `AddSubAdmin` is a page component for adding a new sub-admin user.
 * It provides a form with fields for name, email, phone number, region, and a profile image.
 * The form includes validation for each field. On successful submission, it displays a success toast.
 * @returns {JSX.Element} The rendered page component.
 */
export default function AddSubAdmin() {
  const methods = useForm<AddSubAdminForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      region: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { showPopup } = usePopupStore();
  const { data: regionsLookup } = useAppGetLookupData(LookupTable.Countries);

  const regionOptions =
    regionsLookup?.map((item) => ({
      value: String(item.id),
      label: item.name ?? "Unknown",
    })) ?? [];

  const { mutateAsync: createSubAdmin} = useAdminCreateSubAdmin({
    onError: (error) => {
      toast.error("Failed to add Sub-Admin. Please try again.");
      console.error("Create sub-admin error:", error);
    },
  });

  const handleSaveConfirmation = async (data: AddSubAdminForm) => {
    await showPopup({
      title: "Add Sub-Admin",
      body: "Are you sure you want to save this details?",
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
            const payload: AdminCreateSubAdminBody = {
              name: data.name,
              email: data.email,
              phoneNumber: data.phoneNumber,
              regionId: Number(data.region),
              password: data.password,
            };

            await createSubAdmin({ body: payload });
            toast.success("Sub-Admin added successfully!");
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
        <p className="mt-2 mb-6 font-semibold">Add Sub-Admin</p>
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
              <PasswordInput
                name="password"
                label="Password"
                required
                rules={{
                  required: "Password is required",
                  validate: (v) => validatePassword(v, ""),
                }}
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
                name="region"
                label="Select Regions"
                placeholder="Select Region"
                options={regionOptions}
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
