import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { EngineerFormData } from "../types";
import BasicInformation from "../addEngineer/BasicInformation";
import Documents from "../addEngineer/Documents";
import ExperienceDetails from "../addEngineer/ExperienceDetails";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminGetEngineerById } from "@/shared/apiServices/admin/adminOpenApiService"
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { usePhoneCountries } from "@/shared/apiServices/client/clientService";

/**
 * EditEngineer component for editing an existing engineer.
 * Fetches engineer data via API.
 */
export default function EditEngineer() {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showPopup } = usePopupStore();
  const { data: phoneCountries = [] } = usePhoneCountries();

  // Fetch engineer data
  const { data: engineerData, isLoading } = useAdminGetEngineerById(Number(id), !!id);

  // Initialize form
  const methods = useForm<EngineerFormData>({
    defaultValues: {
      name: engineerData?.name || "",
      email: engineerData?.email || "",
      phoneNumber: engineerData?.phoneNumber || "",
      profileImage: null,
      address: engineerData?.address || "",
      skills: [],
      price: engineerData?.hourlyRate || "",
      serviceCategory: engineerData?.serviceCategoryId?.toString() || "",
      portfolio: engineerData?.portfolioLink || "",
      designation: engineerData?.currentDesignation || "",
      location: "",
      employer: engineerData?.employer || "",
      experience: engineerData?.experienceYears?.toString() || "",
      resume: "",
      governmentId: "",
      certificate: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Update defaultValues when data is loaded
useEffect(() => {
  if (!engineerData) return;

  const rawPhone =
    // engineerData.user?.phone_number ??
    engineerData.phoneNumber ??
    "";

  let formattedPhone = "";

  if (rawPhone) {
    const matchedCountry = phoneCountries.find((c) =>
      rawPhone.startsWith(c.code)
    );

    if (matchedCountry) {
      const nationalNumber = rawPhone.replace(matchedCountry.code, "");
      formattedPhone = `${matchedCountry.code} ${nationalNumber}`;
    } else {
      formattedPhone = rawPhone;
    }
  }

  methods.reset({
    name: engineerData.name ?? "",
    email: engineerData.email ?? "",
    phoneNumber: formattedPhone,
    profileImage: null,
    address: engineerData.address ?? "",
    skills: [],
    price: engineerData.hourlyRate ?? "",
    serviceCategory: engineerData.serviceCategoryId
      ? String(engineerData.serviceCategoryId)
      : "",
    portfolio: engineerData.portfolioLink ?? "",
    designation: engineerData.currentDesignation ?? "",
    location: "",
    employer: engineerData.employer ?? "",
    experience: engineerData.experienceYears
      ? String(engineerData.experienceYears)
      : "",
    resume: "",
    governmentId: "",
    certificate: "",
  });
}, [engineerData, phoneCountries, methods]);

  const { trigger, getValues, reset } = methods;

  // Tab navigation
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
    if (activeTab === "Experience Details") setActiveTab("Basic Information");
    else if (activeTab === "Documents") setActiveTab("Experience Details");
  };

  // Update confirmation popup
  const handleUpdateConfirmation = async (data: EngineerFormData) => {
    await showPopup({
      title: "Update Engineer",
      body: "Are you sure you want to update these details?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Update",
          value: "save",
          variant: "primary",
          action: async (close) => {
            console.log("Updated data:", data);
            toast.success("Engineer updated successfully!");
            navigate(absoluteUrls.admin.home.manage_engineer);
            reset();
            close(true);
          },
        },
      ],
    });
  };

  // Save handler
  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        handleUpdateConfirmation(getValues());
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const tabs = [
    { label: "Basic Information", content: <BasicInformation />, hide: false },
    { label: "Experience Details", content: <ExperienceDetails />, hide: false },
    { label: "Documents", content: <Documents />, hide: false },
  ];

  const isLastTab = activeTab === "Documents";

  if (isLoading) return <LoaderComponent />;

  return (
    <div className="w-full px-4 h-full mt-6">
      <div className="flex py-3 justify-between gap-4">
        <h2 className="mt-2 mb-4 font-semibold">Edit Engineer</h2>
        <Button variant="solid" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <FormContainer methods={methods}>
        <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-1 mx-auto">
          <AdminTabComponent
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex justify-end gap-x-3 mt-6 px-4 pb-4">
            {activeTab !== "Basic Information" && (
              <Button type="button" onClick={handlePrevious} className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90">
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
