import React, { useState } from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import ClientAdd from "../ClientAdd";
import ClientDocuments from "../ClientDocuments"; 
import { FormProvider, useForm } from "react-hook-form";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import type { ClientFormData } from "../../types";
import { toast } from "react-toastify";

/**
 * CorporateClientEditForm component for editing existing corporate client information.
 * It provides a multi-step form with "Basic Information" and "Documents" tabs.
 * Form state and validation are managed using react-hook-form.
 */
const CorporateClientEditForm: React.FC = () => {
   /**
    * State to manage the currently active tab in the form.
    * @type {string}
    */
   const [activeTab, setActiveTab] = useState("Basic Information");
    /** State to indicate if the form is currently being submitted. */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    /** react-hook-form methods for form management and validation. */
    const methods = useForm<ClientFormData>({
  defaultValues:{
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

/**
 * Handles the "Next" button click.
 * Validates the fields in the "Basic Information" tab and moves to the "Documents" tab if validation is successful.
 */
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

/**
 * Handles the "Save" button click.
 * Triggers validation for the entire form. If valid, it simulates form submission, shows a success toast, and resets the form.
 */
const handleSave = async () => {
  const isValid = await trigger();
  if (isValid) {
    setIsSubmitting(true);
    try {
      const formData = methods.getValues();
      console.log("Form submitted:", formData);
      toast.success("Client information saved successfully!");
      methods.reset();
      setActiveTab("Basic Information");
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
  const isLastTab = activeTab === "Documents";
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
             <div className="bg-white dark:bg-gray-700 rounded-lg p-2 ">
               <AdminTabComponent
                 key={activeTab}
                 tabs={tabs}
                 defaultActiveTab={activeTab}
               />
     
               <div className="flex justify-end mt-6 px-4 pb-4">
                 <Button
                   type="button"
                   onClick={isLastTab ? handleSave : handleNext}
                   disabled={isSubmitting}
                   className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
                 >
                   {isSubmitting ? "Saving…" : isLastTab ? "Save" : "Next"}
                 </Button>
               </div>
             </div>
           </FormProvider>
    </div>
  );
};

export default CorporateClientEditForm;
