import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import BasicInformation from "./BasicInformation";
import ExperienceDetails from "./ExperienceDetails";
import Documents from "./Documents";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { EngineerFormData } from "../types";
import { toast } from "react-toastify";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";

/**
 * AddEngineer component provides a multi-step form interface for adding new engineers to the system.
 * 
 * Features:
 * - Multi-tab form with Basic Information, Experience Details, and Documents sections
 * - Form validation at each step before proceeding
 * - File upload capability for documents and profile image
 * - Progressive form completion with Next/Save buttons
 * - Form state management using react-hook-form
 * 
 * The form is divided into three main sections:
 * 1. Basic Information: Personal and professional details
 * 2. Experience Details: Work history and qualifications
 * 3. Documents: Required documentation and certificates
 * 
 * @component
 * @example
 * ```tsx
 * <AddEngineer />
 * ```
 * 
 * @returns {JSX.Element} A multi-step form component for adding new engineers
 */
export default function AddEngineer() {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<EngineerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImage: null,
      address: "",
      skills: "",
      price: 0,
      serviceCategory: "",
      portfolio: "",
      resume: "",
      designation: "",
      location: "",
      employer: "",
      experience: "",
      governmentId: "",
      certificate: "",
    },
  });

  const { trigger } = methods;

  const handleNext = async () => {
    let isValid = false;

    if (activeTab === "Basic Information") {
      isValid = await trigger([
        "name",
        "email",
        "phoneNumber",
        "address",
        "skills",
        "price",
        "serviceCategory",
        "portfolio",
      ]);
      if (isValid) setActiveTab("Experience Details");
    } else if (activeTab === "Experience Details") {
      isValid = await trigger([
        "designation",
        "location",
        "employer",
        "experience",
      ]);
      if (isValid) setActiveTab("Documents");
    }
  };

  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        const data = methods.getValues();
        console.log("Full form ", data);
        toast.success("Engineer added successfully!");
        methods.reset();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <BasicInformation />,
      hide: false,
    },
    {
      label: "Experience Details",
      content: <ExperienceDetails />,
      hide: false,
    },
    {
      label: "Documents",
      content: <Documents />,
      hide: false,
    },
  ];

  const isLastTab = activeTab === "Documents";

  return (
    <div>
      <div className="flex justify-between gap-4">
        <h2 className="mt-2 mb-6 font-semibold">Add Engineer</h2>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(`${absoluteUrls.admin.home.manage_engineer}`)}
        >
          Back
        </Button>
      </div>
      <FormProvider {...methods}>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mx-auto">
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
}
