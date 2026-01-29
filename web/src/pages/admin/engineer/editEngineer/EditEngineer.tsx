import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { EngineerFormData } from "../types";
import BasicInformation from "../addEngineer/BasicInformation";
import Documents from "../addEngineer/Documents";
import ExperienceDetails from "../addEngineer/ExperienceDetails";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * EditEngineer component for editing an existing engineer.
 * Pre-filled with dummy data for development/testing.
 */
export default function EditEngineer() {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  // Find by ID (replace with real API call if needed)
  const editEngineer = manageEngineer.find((user) => user.id.toString() === id);

  const methods = useForm<EngineerFormData>({
    defaultValues: {
      name: editEngineer?.details.name || "John Doe",
      email: editEngineer?.details.email || "john.doe@example.com",
      phoneNumber: editEngineer?.details.phone || "+91 9876576512",
      profileImage: null,
      address: "123 Tech Street, San Francisco, CA",
      skills: ["React", "TypeScript", "Next.js"],
      price: "75.5",
      serviceCategory: "Legal Services",
      portfolio: "https://alexj.dev",
      designation: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      employer: "Tech Innovators Inc.",
      experience: "5",
      resume: "",
      governmentId: "",
      certificate: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { trigger } = methods;
  const { showPopup } = usePopupStore();

  // Handle Next button navigation between tabs
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
      ]);
      if (isValid) setActiveTab("Experience Details");
    } else if (activeTab === "Experience Details") {
      isValid = await trigger([
        "designation",
        "location",
        "resume",
        "employer",
        "experience",
      ]);
      if (isValid) setActiveTab("Documents");
    }
  };

  const handlePrevious = async () => {
    if (activeTab === "Experience Details") {
      setActiveTab("Basic Information");
    } else if (activeTab === "Documents") {
      setActiveTab("Experience Details");
    }
  };

  const handleupdateConfirmation = async (data: EngineerFormData) => {
    await showPopup({
      title: "Update Engineer",
      body: "Are you sure you want to update this details?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Update",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("data :", data);
            // TODO: call your delete API here
            // await deleteJob(job.id);
            toast.success("Engineer updated successfully!");
            navigate(absoluteUrls.admin.home.manage_engineer);
            methods.reset();
            close(true);
          },
        },
      ],
    });
  };

  // Handle form submission
  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        const data = methods.getValues();
        handleupdateConfirmation(data);
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
    <div className="w-full px-4 h-full mt-6">
      <div className="flex py-3 justify-between gap-4">
        <h2 className="mt-2 mb-4 font-semibold">Edit Engineer</h2>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <FormContainer methods={methods}>
        <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-1 mx-auto">
          {/* FIX: Use controlled props for tab switching */}
          <AdminTabComponent
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex justify-end gap-x-3 mt-6 px-4 pb-4">
            {activeTab !== "Basic Information" && (
              <Button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
              >
                Back
              </Button>
            )}

            <Button
              type="button"
              onClick={isLastTab ? handleSave : handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : isLastTab ? "Save" : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
