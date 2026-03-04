import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import PhoneInputField from "@/shared/components/commonUI/inputs/PhoneInputField";
import SelectField from "@/shared/components/commonUI/inputs/SelectField";
import { validateName } from "@/utils/validate";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { EditSubAdminForm } from "./types";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  LookupTable,
  useAppGetLookupData,
  useAdminGetSubAdmins,
  useAdminUpdateSubAdmin,
} from "@/shared/apiServices/admin/adminOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useEffect, useMemo } from "react";

export default function EditSubAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showPopup } = usePopupStore();

  const parsedId = Number(id);

  const { data: subAdminsData, isLoading: isSubAdminsLoading } =
    useAdminGetSubAdmins({
      page: 1,
      limit: 1000,
    });

  const subAdminList = useMemo(() => {
    return subAdminsData?.data ?? [];
  }, [subAdminsData]);

  const subAdmin = subAdminList.find((user) => user.id === parsedId);

  const { data: regionsLookup, isLoading: isRegionsLoading } =
    useAppGetLookupData(LookupTable.Regions);

  const regionOptions =
    regionsLookup?.map((item) => ({
      value: String(item.id),
      label: item.name || `Region ${item.id}`,
    })) ?? [];

  const methods = useForm<EditSubAdminForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      region: "",
    },
  });

  /* ------------------ RESET WHEN DATA LOADS ------------------ */
  useEffect(() => {
    if (!subAdmin) return;

    methods.reset({
      name: subAdmin.name || "",
      email: subAdmin.email || "",
      phoneNumber: subAdmin.phoneNumber || "",
      region: subAdmin.regionId?.toString() || "",
    });
  }, [subAdmin, methods]);

  const validateEmailUnique = (value: string) => {
    if (!value) return true;

    const exists = subAdminList.some(
      (admin) =>
        admin.id !== parsedId &&
        admin.email.toLowerCase() === value.toLowerCase(),
    );

    return exists ? "Email must be unique" : true;
  };

  const validatePhoneUnique = (value: string) => {
    if (!value) return true;

    const normalizedValue = value.replace(/\s+/g, "");

    const exists = subAdminList.some(
      (admin) =>
        admin.id !== parsedId &&
        admin.phoneNumber &&
        admin.phoneNumber.replace(/\s+/g, "") === normalizedValue,
    );

    return exists ? "Phone number must be unique" : true;
  };

  const { mutateAsync: updateSubAdmin, isPending } = useAdminUpdateSubAdmin({
    onError: () => {
      toast.error("Failed to update Sub-Admin.");
    },
  });

  const handleSaveConfirmation = async (data: EditSubAdminForm) => {
    await showPopup({
      title: "Update Sub-Admin",
      body: "Are you sure you want to update these details?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              await updateSubAdmin({
                path: { userId: subAdmin!.userId },
                query: {
                  regionId: Number(data.region),
                },
                body: {
                  name: data.name,
                  email: data.email,
                  phoneNumber: data.phoneNumber,
                },
              });

              toast.success("Sub-Admin updated successfully!");
              navigate(absoluteUrls.admin.home.manage_sub_admin);
              close(true);
            } catch {
              close(false);
            }
          },
        },
      ],
    });
  };

  const onSubmit = (data: EditSubAdminForm) => {
    handleSaveConfirmation(data);
  };

  /* ------------------ LOADING ------------------ */
  if (isSubAdminsLoading || isRegionsLoading) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center min-h-[60vh]">
        <LoaderComponent />
      </div>
    );
  }

  if (!subAdmin) {
    return (
      <div className="w-full h-full p-4 text-center text-red-600">
        Sub-admin not found
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Edit Sub-Admin</p>
        <Button
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_sub_admin)}
        >
          Back
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <FormContainer methods={methods} onSubmit={onSubmit}>
          <div className="grid md:flex gap-4 w-full">
            <div className="w-full md:w-1/2 space-y-2">
              <InputField
                name="name"
                label="Full Name"
                type="text"
                required
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
            </div>

            <div className="w-full md:w-1/2 space-y-2">
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
                options={regionOptions}
                required
              />
            </div>
          </div>

          <div className="my-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit bg-gradient-to-r from-teal-900 to-teal-700 text-white py-2 px-6 rounded-lg hover:opacity-90 transition"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
