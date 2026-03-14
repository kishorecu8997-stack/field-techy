import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import {
  useAdminGetEngineerById,
  useAdminUpdateEngineer,
  useAdminMarkFileAsUploaded,
  type AdminUpdateEngineerBody,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { queryKeys } from "@/shared/apiServices/queryKeys";
import { Button } from "@/shared/components/commonUI/Buttons";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { usePopupStore } from "@/shared/store/popupStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { AdminGetEngineerResponse, AdminUpdateEngineerData } from "@/api";
import BasicInformation from "../addEngineer/BasicInformation";
import ExperienceDetails from "../addEngineer/ExperienceDetails";
import Documents from "../userDetails/Documents";
import type { EngineerFormData } from "../types";

const toOptionalString = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const mapEngineerToFormData = (
  engineer: AdminGetEngineerResponse,
): EngineerFormData => {
  const skills = engineer.skills?.map((s) => String(s.id)) ?? [];

  return {
    // Basic Information
    name: engineer.name ?? "",
    email: engineer.email ?? "",
    phoneNumber: engineer.phoneNumber ?? "",
    profileImage: engineer.documents?.profileImage?.url ?? null,
    address: engineer.address ?? "",
    skills,
    price: toOptionalString(engineer.pricePerHour),
    serviceCategory: engineer.serviceCategory
      ? String(engineer.serviceCategory)
      : "",
    portfolio: engineer.portfolioLink ?? "",
    country: engineer.country?.id ? String(engineer.country?.id) : "",
    state: engineer.state?.id ? String(engineer.state?.id) : "",
    city: engineer.city?.id ? String(engineer.city?.id) : "",
    postalCode: engineer.location?.postalCode ?? "",

    // Experience Details
    designation: engineer.currentDesignation ?? "",
    employer: engineer.employer ?? "",
    experience: toOptionalString(engineer.totalExperience),
    resume: engineer.documents?.resume?.url ?? null,

    // Documents
    governmentId: engineer.documents?.governmentId?.url ?? null,
    certificate: engineer.documents?.qualificationCertificate?.url ?? null,
  };
};

export default function EditEngineer() {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  const { mutateAsync: updateEngineer } = useAdminUpdateEngineer();
  const { mutateAsync: markFileUploaded } = useAdminMarkFileAsUploaded();

  const engineerId = Number(id);
  const hasValidEngineerId = Number.isFinite(engineerId) && engineerId > 0;

  const {
    data: engineerData,
    isLoading,
    error,
  } = useAdminGetEngineerById(engineerId, {
    refetchOnMount: "always",
  });

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
      employer: "",
      experience: "",
      resume: null,
      governmentId: null,
      certificate: null,
      country: "",
      state: "",
      city: "",
      postalCode: "",
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
      "country",
      "state",
      "city",
      "postalCode",
    ]);

  const validateExperienceDetails = () =>
    trigger(["designation", "resume", "employer", "experience"]);

  const validateDocuments = () => trigger(["governmentId", "certificate"]);

  useEffect(() => {
    if (!engineerData) return;
    reset(mapEngineerToFormData(engineerData));
  }, [engineerData, reset]);

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
      countryId: data.country ? Number(data.country) : undefined,
      stateId: data.state ? Number(data.state) : undefined,
      cityId: data.city ? Number(data.city) : undefined,
      skills: skillsArray?.length ? skillsArray.map(Number) : undefined,
      postalCode: data.postalCode || undefined,
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
    let ok = false;

    if (activeTab === "Basic Information") {
      ok = await validateBasicInformation();
      if (!ok) return;
      setActiveTab("Experience Details");
    } else if (activeTab === "Experience Details") {
      ok = await validateExperienceDetails();
      if (!ok) return;
      setActiveTab("Documents");
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
                body: body as AdminUpdateEngineerBody,
              });

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
                      path: { userId: engineerId },
                      body: { fileId },
                    });
                  }
                }
              }

              await queryClient.invalidateQueries({
                queryKey: queryKeys.admin.manageEngineers,
                exact: false,
              });
              await queryClient.invalidateQueries({
                queryKey: queryKeys.admin.adminGetEngineer,
                exact: false,
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

    const okBasic = await validateBasicInformation();
    if (!okBasic) return;

    const okExp = await validateExperienceDetails();
    if (!okExp) return;

    const okDocs = await validateDocuments();
    if (!okDocs) return;

    setIsSubmitting(true);
    try {
      await handleUpdateConfirmation(getValues());
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <BasicInformation disableEmail={true} />,
      hide: false,
    },
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

    if (nextTab === "Experience Details") {
      const ok = await validateBasicInformation();
      if (!ok) return;
    }

    if (nextTab === "Documents") {
      const okBasic = await validateBasicInformation();
      const okExp = await validateExperienceDetails();
      if (!okBasic || !okExp) return;
    }

    setActiveTab(nextTab);
  };

  if (isLoading) return <LoaderComponent />;

  if (!hasValidEngineerId)
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          Missing engineer id in the URL.
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          An error occurred while fetching engineer details.
        </div>
      </div>
    );

  if (!engineerData)
    return (
      <div className="w-full px-4 h-full mt-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
          Engineer details not found.
        </div>
      </div>
    );

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
                variant="no_style"
                className="border border-solid rounded-md hover:transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={handlePrevious}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={isLastTab ? handleSave : handleNext}
              disabled={isSubmitting}
              className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
            >
              {isSubmitting ? "Saving..." : isLastTab ? "Save" : "Next"}
            </Button>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
