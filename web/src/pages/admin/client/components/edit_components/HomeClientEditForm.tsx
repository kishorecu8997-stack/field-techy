import React, { useState } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import ClientAdd from "../ClientAdd";
import ClientDocuments from "../Documents";
import { FormProvider, useForm } from "react-hook-form";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import type { ClientFormData } from "../../types";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * HomeClientEditForm component for editing existing home client information.
 * It features a multi-step form with "Basic Information" and "Documents" tabs.
 * This component uses react-hook-form for form state management and validation.
 */
const HomeClientEditForm: React.FC = () => {
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
            toast.success("Client information update successfully!");
            navigate(absoluteUrls.admin.home.manage_client);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  /**
   * Handles the "Save" button click.
   * It triggers validation for the entire form. If valid, it simulates form submission, displays a success toast, and resets the form.
   */
  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        const formData = methods.getValues();
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

  /**
   * Defines the tabs for the AdminTabComponent.
   */
  const tabs = [
    {
      label: "Basic Information",
      content: <ClientAdd />,
    },
    {
      label: "Documents",
      content: <ClientDocuments />,
    },
  ];
  /** Determines if the current active tab is the last tab ("Documents"). */
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold ">Edit Client</h1>
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

export default HomeClientEditForm;
