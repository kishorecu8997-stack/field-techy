import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField, PasswordInput } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
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
  LookupTable,
  useAppGetLookupData,
  useAdminGetSubAdmins,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { validatePassword } from "@/shared/libs/utils";
import { useMemo } from "react";

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
    mode: "onSubmit",
  });

  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const { data: regionsLookup } = useAppGetLookupData(LookupTable.Regions);

  const regionOptions =
    regionsLookup?.map((item) => ({
      value: String(item.id),
      label: item.name ?? "Unknown",
    })) ?? [];

  const { data: subAdminData } = useAdminGetSubAdmins({
    page: 1,
    limit: 1000,
  });

  const subAdminList = useMemo(() => {
    return subAdminData?.data ?? [];
  }, [subAdminData]);

  const validateEmailUnique = (value: string) => {
    if (!value) return true;

    const exists = subAdminList.some(
      (admin) => admin.email.toLowerCase() === value.toLowerCase(),
    );

    return exists ? "Email must be unique" : true;
  };

  const validatePhoneUnique = (value: string) => {
    if (!value) return true;

    const normalizedValue = value.replace(/\s+/g, "");

    const exists = subAdminList.some(
      (admin) =>
        admin.phoneNumber &&
        admin.phoneNumber.replace(/\s+/g, "") === normalizedValue,
    );

    return exists ? "Phone number must be unique" : true;
  };

  const { mutateAsync: createSubAdmin } = useAdminCreateSubAdmin({
    onSuccess: () => {
      toast.success("Sub-Admin added successfully!");
      navigate(absoluteUrls.admin.home.manage_sub_admin);
      methods.reset();
    },
    onError: () => {
      toast.error("Failed to add Sub-Admin.");
    },
  });

  const handleSaveConfirmation = async (data: AddSubAdminForm) => {
    await showPopup({
      title: "Add Sub-Admin",
      body: "Are you sure you want to save these details?",
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
            try {
              const payload: AdminCreateSubAdminBody = {
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: data.password,
              };

              await createSubAdmin({
                query: {
                  regionId: Number(data.region),
                },
                body: payload,
              });

              close(true);
            } catch (error) {
              console.error(error);
              close(false);
            }
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
                rules={{
                  validate: (v: string) => validateName(v),
                }}
              />

              <PhoneInputField
                name="phoneNumber"
                label="Mobile Number"
                required
                rules={{
                  validate: {
                    unique: validatePhoneUnique,
                  },
                }}
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
                type="email"
                required
                rules={{
                  ...validateEmailRules,
                  validate: {
                    unique: validateEmailUnique,
                  },
                }}
              />

              <SelectField
                name="region"
                label="Select Region"
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
