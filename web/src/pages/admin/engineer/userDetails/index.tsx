import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { useAdminGetEngineerById } from "@/shared/apiServices/admin/adminOpenApiService";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicInformation from "./BasicInformation";
import UserDocuments from "./Documents";
import { FormProvider, useForm } from "react-hook-form";
import type { EngineerFormData } from "../types";
import DisputeReports from "./DisputeReports";
import Wallet from "./Wallet";
import EngineerJobCategory from "./jobCategory";
import type { AdminGetEngineerResponse } from "@/api";
/**
 * UserDetails Component
 *
 * Displays a detailed view of an engineer's profile using a tabbed interface.
 * Each tab shows a specific section of the engineer's data:
 * - Basic Information: Personal and contact details
 * - Documents: Uploaded verification files
 * - Disputes & Reports: List of filed disputes with file previews
 * - Privileges: Access rights and permissions (note: intentional spelling as per UI)
 * - Wallet: Transaction history and balance
 * - Job History: Past and current job assignments
 *
 * The component uses `react-hook-form` for form state management (via `FormProvider`)
 * and includes a "Back" button to navigate to the engineer management list.
 *
 * Tabs are rendered using the shared `AdminTabComponent`, and all child components
 * are pre-wired with the appropriate form context and data.
 *
 * @component
 * @example
 * return (
 *   <UserDetails />
 * );
 *
 * @returns {JSX.Element} The rendered UserDetails page with tabbed engineer profile sections.
 */
export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const engineerId = Number(id);
  const hasValidEngineerId = Number.isFinite(engineerId) && engineerId > 0;

  const {
    data: engineerData,
    isLoading,
    error,
  } = useAdminGetEngineerById(engineerId, hasValidEngineerId);

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

  useEffect(() => {
    if (!engineerData) return;
    methods.reset(mapEngineerToFormData(engineerData));
  }, [engineerData, methods]);

  const tabs = [
    {
      label: "Basic Information",
      content: <BasicInformation engineer={engineerData} />,
      hide: false,
    },
    {
      label: "Documents",
      content: <UserDocuments isView />,
      hide: false,
    },
    {
      label: "Disputes & Reports",
      content: <DisputeReports />,
      hide: false,
    },
    {
      label: "Wallet",
      content: <Wallet walletBalance={engineerData?.walletBalance} />,
      hide: false,
    },
    {
      label: "Job History",
      content: <EngineerJobCategory />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <div className="flex justify-between mt-4">
        <h1 className="font-semibold ">User Details</h1>
        <div className="flex gap-4">
          <Button variant="solid" className="" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <FormProvider {...methods}>
          {!hasValidEngineerId ? (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
              Missing engineer id in the URL.
            </div>
          ) : isLoading ? (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 flex items-center justify-center">
              <LoaderComponent />
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center text-red-600 dark:text-red-300">
              An error occurred while fetching engineer details.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
              <AdminTabComponent
                tabs={tabs}
                defaultActiveTab="Basic Information"
              />
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  );
}

const toOptionalString = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const mapEngineerToFormData = (
  engineer: AdminGetEngineerResponse,
): EngineerFormData => {
  const skills = engineer.skills?.map((s) => String(s.id)) ?? [];

  return {
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
    designation: engineer.currentDesignation ?? "",
    location: engineer.location?.city ?? engineer.city?.name ?? "",
    employer: engineer.employer ?? "",
    experience: toOptionalString(engineer.totalExperience),
    resume: engineer.documents?.resume?.url ?? null,
    governmentId: engineer.documents?.governmentId?.url ?? null,
    certificate: engineer.documents?.qualificationCertificate?.url ?? null,
  };
};
