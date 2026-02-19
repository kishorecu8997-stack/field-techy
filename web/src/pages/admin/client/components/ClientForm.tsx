import React, { useState, useEffect } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormProvider, useForm } from "react-hook-form";
import { absoluteUrls } from "@/config/urls";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type { ClientFormData } from "../types";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import ClientAdd from "./ClientAdd";
import Documents from "./Documents";

interface ClientFormProps {
  isEdit?: boolean;
}

/**
 * ClientForm component renders the form for adding or editing a client.
 * It is designed to be nested within a `FormProvider` from `react-hook-form`.
 * This component includes fields for client type, profile image, company details, contact information, and address.
 * It utilizes custom input components like `InputField`, `SelectField`, `ImageUploaderField`, and `PhoneInputField`,
 * and applies validation rules to them.
 */
const ClientForm: React.FC<ClientFormProps> = ({ isEdit: propIsEdit }) => {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showPopup } = usePopupStore();

  const isEdit = propIsEdit ?? location.pathname.includes("edit");
  const typeParam = searchParams.get("type") as "corporate" | "home" | null;

  const methods = useForm<ClientFormData>({
    mode: "onChange",
    defaultValues: {
      clientType: typeParam || "corporate",
      profileImage: null,
      companyName: "",
      phoneNumber: "",
      email: "",
      industry: "",
      country: "",
      city: "",
      taxDocument: "",
      contactPersonName: "",
      businessType: "",
      address: "",
      state: "",
      postalCode: "",
      vatRegistrationNumber: "",
      governmentIDProof: null,
      certificate: null,
    },
  });

  const { trigger, getValues, watch, setValue } = methods;
  const clientType = watch("clientType");

  useEffect(() => {
    if (typeParam && !isEdit) {
      setValue("clientType", typeParam);
    }
  }, [typeParam, setValue, isEdit]);

  const handleNext = async () => {
    if (activeTab === "Basic Information") {
      const fieldsToValidate: (keyof ClientFormData)[] = [
        "clientType",
        "phoneNumber",
        "email",
        "contactPersonName",
        "country",
        "city",
        "state",
        "postalCode",
      ];

      if (clientType === "corporate") {
        fieldsToValidate.push(
          "companyName",
          "industry",
          "businessType",
          "address",
          "vatRegistrationNumber",
          "taxDocument",
        );
      }

      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setActiveTab("Documents");
      }
    }
  };

  const handleSaveConfirmation = async (data: ClientFormData) => {
    await showPopup({
      title: isEdit ? "Update Client" : "Add Client",
      body: `Are you sure you want to ${isEdit ? "update" : "save"} this details?`,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: isEdit ? "Update" : "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Submitting data:", data);
            toast.success(
              `Client information ${isEdit ? "updated" : "saved"} successfully!`,
            );
            navigate(absoluteUrls.admin.home.manage_client);
            close(true);
          },
        },
      ],
    });
  };

  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        const formData = getValues();
        await handleSaveConfirmation(formData);
      } catch (error) {
        console.error("Error saving client information:", error);
        toast.error("An error occurred while saving client information.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const errors = methods.formState.errors;
      const basicInfoFields: (keyof ClientFormData)[] = [
        "clientType",
        "phoneNumber",
        "email",
        "contactPersonName",
        "country",
        "city",
        "state",
        "postalCode",
        "companyName",
        "industry",
        "businessType",
        "address",
        "vatRegistrationNumber",
        "taxDocument",
      ];

      const hasBasicInfoError = basicInfoFields.some((field) => errors[field]);
      if (hasBasicInfoError) {
        setActiveTab("Basic Information");
      }
      toast.error("Please fix the errors in the form before saving.");
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <ClientAdd isEdit={isEdit} />,
    },
    {
      label: "Documents",
      content: <Documents />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">
          {isEdit
            ? clientType === "corporate"
              ? "Corporate Client"
              : "Home Client"
            : "Add Client"}
        </h1>
        <Button
          variant="solid"
          onClick={() => navigate(absoluteUrls.admin.home.manage_client)}
        >
          Back
        </Button>
      </div>

      <FormProvider {...methods}>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
          <AdminTabComponent
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex justify-end mt-6 px-4 pb-4">
            <Button
              type="button"
              onClick={activeTab === "Documents" ? handleSave : handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
            >
              {isSubmitting
                ? "Saving…"
                : activeTab === "Documents"
                  ? isEdit
                    ? "Update"
                    : "Save"
                  : "Next"}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default ClientForm;
