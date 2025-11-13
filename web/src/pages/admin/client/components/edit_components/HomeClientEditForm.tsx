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

const HomeClientEditForm: React.FC = () => {
   const [activeTab, setActiveTab] = useState("Basic Information");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
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
  const isLastTab = activeTab === "Documents"
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold ">Edit Clients</h1>
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

export default HomeClientEditForm;