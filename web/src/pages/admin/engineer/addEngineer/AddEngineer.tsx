import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { EngineerFormData } from "../types";
import BasicInformation from "./BasicInformation";
import Documents from "./Documents";
import ExperienceDetails from "./ExperienceDetails";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAdminAddEngineer } from "@/shared/apiServices/admin/adminOpenApiService";
import { useAppMarkProfileFileUploaded } from "@/shared/apiServices/commonOpenApiService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import type {
  AdminCreateEngineerData,
  AppMarkProfileFileUploadedData,
} from "@/api";
import { useCheckUserExistence } from "@/shared/apiServices/commonOpenApiService"


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
  const queryClient = useQueryClient();
  const { showPopup } = usePopupStore();
  const { mutateAsync: addEngineer } = useAdminAddEngineer();
  const { mutateAsync: markFileUploaded } = useAppMarkProfileFileUploaded();
  const methods = useForm<EngineerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImage: null,
      address: "",
      skills: "",
      price: null,
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
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { trigger, getValues, reset, setError, clearErrors } = methods;

  const email = methods.watch("email");
  const phone = methods.watch("phoneNumber");

  const { data: userExists, isFetching: checkingUser } = useCheckUserExistence({
    email,
    phone,
    enabled: (email?.length ?? 0) > 5 || (phone?.length ?? 0) > 7,
  });

useEffect(() => {
  if (checkingUser) return;

  // Email check
  if (userExists?.emailExists) {
    setError("email", {
      type: "manual",
      message: "User already exists with this email",
    });
  } else {
    clearErrors("email");
  }

  // Phone check
  if (userExists?.phoneExists) {
    setError("phoneNumber", {
      type: "manual",
      message: "User already exists with this phone number",
    });
  } else {
    clearErrors("phoneNumber");
  }
}, [userExists, checkingUser, setError, clearErrors]);

  const validateBasicInformation = () =>
    trigger([
      "name",
      "email",
      "phoneNumber",
      "address",
      "skills",
      "price",
      "serviceCategory",
    ]);

  const validateExperienceDetails = () =>
    trigger(["designation", "resume", "location", "employer", "experience"]);

  const validateDocuments = () => trigger(["governmentId", "certificate"]);

  const extractFile = (v: unknown) =>
    v instanceof File ? v : (v instanceof FileList && v[0]) || null;
  const buildPayload = (data: EngineerFormData) => {
    const files = {
      profilePicture: extractFile(data.profileImage),
      govIdDoc: extractFile(data.governmentId),
      certificateDoc: extractFile(data.certificate),
      resumeFile: extractFile(data.resume),
    };

    const skillsArray =
      typeof data.skills === "string"
        ? data.skills.split(",").map((s) => s.trim())
        : data.skills;

    const body: AdminCreateEngineerData["body"] = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,

      address: data.address || undefined,
      serviceCategoryId: data.serviceCategory
        ? Number(data.serviceCategory)
        : undefined,

      hourlyRate:
        data.price !== null && data.price !== ""
          ? Number(data.price)
          : undefined,

      portfolioLink: data.portfolio || "",
      employer: data.employer || undefined,
      currentDesignation: data.designation || undefined,

      experienceYears: data.experience ? Number(data.experience) : null,

      skills: skillsArray?.length ? skillsArray.map(Number) : undefined,
    };

    (Object.entries(files) as [keyof typeof files, File | null][]).forEach(
      ([key, file]) => {
        if (!file) return;

        body[key] = {
          filename: file.name,
          size: file.size,
          mimeType: file.type,
        };
      },
    );
    return { body, files };
  };

  const handleNext = async () => {
    const exists = userExists?.emailExists === true || userExists?.phoneExists === true;

    if (exists) {
      toast.error("User already exists");
      return;
    }
    let isValid = false;

    if (activeTab === "Basic Information") {
      isValid = await validateBasicInformation();
      if (isValid) setActiveTab("Experience Details");
    } else if (activeTab === "Experience Details") {
      isValid = await validateExperienceDetails();
      if (isValid) setActiveTab("Documents");
    }
  };

  const handlePrevious = () => {
    if (activeTab === "Experience Details") setActiveTab("Basic Information");
    else if (activeTab === "Documents") setActiveTab("Experience Details");
  };

  const handleSaveConfirmation = async (data: EngineerFormData) => {
    await showPopup({
      title: "Add Engineer",
      body: "Are you sure you want to save this details?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Save",
          value: "save",
          variant: "primary",
          action: async (close) => {
            try {
              const { body, files } = buildPayload(data);
              const res = await addEngineer({
                body,
              } as AdminCreateEngineerData);
              if (res && "uploadUrls" in res && res.uploadUrls) {
                const uploadUrls = res.uploadUrls as Record<
                  string,
                  { uploadUrl: string; fileId: number }
                >;
                for (const [key, { uploadUrl, fileId }] of Object.entries(
                  uploadUrls,
                )) {
                  const file = files[key as keyof typeof files];
                  if (!file) continue;

                  const upload = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type },
                  });
                  if (upload.ok) {
                    await markFileUploaded({
                      body: { fileId },
                    } as AppMarkProfileFileUploadedData);
                  }
                }
              }

              await queryClient.invalidateQueries({
                queryKey: queryKeys.admin.manageEngineers,
              });
              toast.success("Engineer added successfully!");
              reset();
              navigate(absoluteUrls.admin.home.manage_engineer);
              close(true);
            } catch (error) {
              console.error(error);
              toast.error("Failed to add engineer");
              close(false);
            }
          },
        },
      ],
    });
  };

  const handleSave = async () => {
    if (userExists) {
      toast.error("User already exists");
      return;
    }

    const isValidBasic = await validateBasicInformation();
    if (!isValidBasic) return;

    const isValidExperience = await validateExperienceDetails();
    if (!isValidExperience) return;

    const isValidDocs = await validateDocuments();
    if (!isValidDocs) return;
    setIsSubmitting(true);
    try {
      await handleSaveConfirmation(getValues());
    } finally {
      setIsSubmitting(false);
    }
  };
  const tabs = [
    { label: "Basic Information", content: <BasicInformation /> },
    { label: "Experience Details", content: <ExperienceDetails /> },
    { label: "Documents", content: <Documents /> },
  ];

  const isLastTab = activeTab === "Documents";

  const handleTabChange = async (nextTab: string) => {
    if (nextTab === activeTab) return;

    const order = ["Basic Information", "Experience Details", "Documents"];
    const currentIndex = order.indexOf(activeTab);
    const nextIndex = order.indexOf(nextTab);

    if (nextIndex === -1) return;
    if (nextIndex <= currentIndex) {
      setActiveTab(nextTab);
      return;
    }

    if (currentIndex < 1 && nextIndex >= 1) {
      const ok = await validateBasicInformation();
      if (!ok) return;
    }

    if (currentIndex < 2 && nextIndex >= 2) {
      const ok = await validateExperienceDetails();
      if (!ok) return;
    }

    setActiveTab(nextTab);
  };

  return (
    <div className="w-full px-4 h-full mt-6">
      <div className="flex py-3 justify-between gap-4">
        <h2 className="mt-2 mb-4 font-semibold">Add Engineer</h2>
        <Button variant="solid" className="" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <FormContainer
        methods={methods}
        className="bg-white dark:bg-gray-700 rounded-lg p-2 mx-auto"
      >
        <div className="bg-white dark:bg-gray-700 rounded-lg p-2 mx-auto">
          <AdminTabComponent
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
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
              disabled={isSubmitting || checkingUser}
              className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90"
            >
              {isSubmitting ? "Saving…" : isLastTab ? "Save" : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
