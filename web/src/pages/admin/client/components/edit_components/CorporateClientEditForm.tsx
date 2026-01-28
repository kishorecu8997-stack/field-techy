import React, { useState } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import ClientDocuments from "../Documents";
import { FormProvider, useForm } from "react-hook-form";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import type { ClientFormData } from "../../types";
import { toast } from "react-toastify";
import ClientEdit from "../ClientEdit";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * CorporateClientEditForm component for editing existing corporate client information.
 * It provides a multi-step form with "Basic Information" and "Documents" tabs.
 * Form state and validation are managed using react-hook-form.
 */
const CorporateClientEditForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<ClientFormData>({
    mode: "onChange",
    defaultValues: {
      profileImage: null,
      companyName: "",
      phoneNumber: "",
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
      qualificationCertificate: null,
    },
  });

  const { trigger } = methods;

  const handleNext = async () => {
    let isValid = false;

    if (activeTab === "Basic Information") {
      isValid = await trigger([
        "companyName",
        "phoneNumber",
        "industry",
        "country",
        "city",
        "taxDocument",
        "contactPersonName",
        "businessType",
        "address",
        "state",
        "postalCode",
        "vatRegistrationNumber",
      ]);
      if (isValid) {
        setActiveTab("Documents");
      }
    }
  };

  const { showPopup } = usePopupStore();

  const handleSaveConfirmation = async (data: ClientFormData) => {
    await showPopup({
      title: "Update Client",
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
            toast.success("Client information updated successfully!");
            navigate(absoluteUrls.admin.home.manage_client);
            methods.reset();
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
        const formData = methods.getValues();
        console.log("Form submitted:", formData);
        navigate(absoluteUrls.admin.home.manage_client);
        methods.reset();
        setActiveTab("Basic Information");
        handleSaveConfirmation(formData);
      } catch (error) {
        console.error("Error saving client information:", error);
        toast.error("An error occurred while saving client information.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <ClientEdit />,
    },
    {
      label: "Documents",
      content: <ClientDocuments />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">Edit Client</h1>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(`${absoluteUrls.admin.home.manage_client}`)}
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
                  ? "Save"
                  : "Next"}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default CorporateClientEditForm;
