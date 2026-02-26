import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import {
  useAdminGetEngineerById,
  useAdminUpdateEngineer,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import { useAppMarkProfileFileUploaded } from "@/shared/apiServices/commonOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type {
  AdminGetEngineerResponse,
  AdminUpdateEngineerData,
  AppMarkProfileFileUploadedData,
} from "@/api";
import BasicInformation from "../addEngineer/BasicInformation";
import ExperienceDetails from "../addEngineer/ExperienceDetails";
import Documents from "../userDetails/Documents";
import type { EngineerFormData } from "../types";

const toOptionalString = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const mapEngineerToFormData = (
  engineerData: AdminGetEngineerResponse,
): EngineerFormData => {
  const skills = engineerData.skills?.map((s) => String(s.id)) ?? [];

  return {
    name: engineerData.name ?? "",
    email: engineerData.email ?? "",
    phoneNumber: engineerData.phoneNumber ?? "",
    profileImage: engineerData.documents?.profileImage?.url ?? null,
    address: engineerData.address ?? "",
    skills,
    price: toOptionalString(engineerData.pricePerHour),
    serviceCategory: engineerData.serviceCategory
      ? String(engineerData.serviceCategory)
      : "",
    portfolio: engineerData.portfolioLink ?? "",
    designation: engineerData.currentDesignation ?? "",
    location: engineerData.location?.city ?? engineerData.city?.name ?? "",
    employer: engineerData.employer ?? "",
    experience: toOptionalString(engineerData.totalExperience),
    resume: engineerData.documents?.resume?.url ?? null,
    governmentId: engineerData.documents?.governmentId?.url ?? null,
    certificate: engineerData.documents?.qualificationCertificate?.url ?? null,
  };
};

/**
 * EditEngineer component for editing an existing engineer.
 * - GET: fetches engineer data (including document URLs) and hydrates the form
 * - PUT: submits updated fields, optionally returning presigned upload URLs for files
 */
export default function EditEngineer() {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const { mutateAsync: updateEngineer } = useAdminUpdateEngineer();
  const { mutateAsync: markFileUploaded } = useAppMarkProfileFileUploaded();

  const engineerId = Number(id);
  const hasValidEngineerId = Number.isFinite(engineerId) && engineerId > 0;

  const { data: engineerData, isLoading, error } = useAdminGetEngineerById(
    engineerId,
    hasValidEngineerId,
  );

  const methods = useForm<EngineerFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImage: null,
      address: "",
      skills: [],
      price: "",
      serviceCategory: "",
      portfolio: "",
      designation: "",
      location: "",
      employer: "",
      experience: "",
      resume: null,
      governmentId: null,
      certificate: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { trigger, getValues, reset } = methods;

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
    trigger(["designation", "location", "resume", "employer", "experience"]);

  const validateDocuments = () => trigger(["governmentId", "certificate"]);

  useEffect(() => {
    if (!engineerData) return;
    methods.reset(mapEngineerToFormData(engineerData));
  }, [engineerData, methods]);

  type UploadKey =
    | "profilePicture"
    | "govIdDoc"
    | "certificateDoc"
    | "resumeFile";

  const extractFile = (value: unknown) =>
    value instanceof File
      ? value
      : (value instanceof FileList && value[0]) || null;

  const buildPayload = (data: EngineerFormData) => {
    const files: Record<UploadKey, File | null> = {
      profilePicture: extractFile(data.profileImage),
      govIdDoc: extractFile(data.governmentId),
      certificateDoc: extractFile(data.certificate),
      resumeFile: extractFile(data.resume),
    };

    const skillsArray =
      typeof data.skills === "string"
        ? data.skills.split(",").map((s) => s.trim())
        : data.skills;

    const body: NonNullable<AdminUpdateEngineerData["body"]> = {
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

    (Object.entries(files) as [UploadKey, File | null][]).forEach(
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
    let isValid = false;
    if (activeTab === "Basic Information") {
      isValid = await validateBasicInformation();
      if (isValid) setActiveTab("Experience Details");
      return;
    }

    if (activeTab === "Experience Details") {
      isValid = await validateExperienceDetails();
      if (isValid) setActiveTab("Documents");
    }
  };

  const handlePrevious = () => {
    if (activeTab === "Experience Details") setActiveTab("Basic Information");
    else if (activeTab === "Documents") setActiveTab("Experience Details");
  };

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
            try {
              const { body, files } = buildPayload(data);

              const res = await updateEngineer({
                path: { userId: engineerId },
                body,
              } as AdminUpdateEngineerData);

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

              await queryClient.invalidateQueries({
                queryKey: queryKeys.engineer.adminById(engineerId),
              });

              toast.success("Engineer updated successfully!");
              reset();
              navigate(absoluteUrls.admin.home.manage_engineer);
              close(true);
            } catch (error) {
              console.error(error);
              toast.error("Failed to update engineer");
              close(false);
            }
          },
        },
      ],
    });
  };

  const handleSave = async () => {
    if (!hasValidEngineerId) {
      toast.error("Invalid engineer id");
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
      await handleUpdateConfirmation(getValues());
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { label: "Basic Information", content: <BasicInformation />, hide: false },
    {
      label: "Experience Details",
      content: <ExperienceDetails />,
      hide: false,
    },
    { label: "Documents", content: <Documents />, hide: false },
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

  if (isLoading) return <LoaderComponent />;

  if (!hasValidEngineerId) {
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          Missing engineer id in the URL.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          An error occurred while fetching engineer details.
        </div>
      </div>
    );
  }

  if (!engineerData) {
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          Engineer details not found.
        </div>
      </div>
    );
  }

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
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isLastTab ? "Save" : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
