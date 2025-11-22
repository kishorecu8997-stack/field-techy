import { absoluteUrls } from "@/config/urls";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";
import BasicInformation from "./BasicInformation";
import UserDocuments from "./Documents";
import { FormProvider, useForm } from "react-hook-form";
import type { EngineerFormData } from "../types";
import DisputeReports from "./DisputeReports";
import Previlage from "./Privilege";
import Wallet from "./Wallet";
import EngineerJobCatagory from "./jobCatagory";
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
  const methods = useForm<EngineerFormData>({});

  const tabs = [
    {
      label: "Basic Information",
      content: <BasicInformation />,
      hide: false,
    },
    {
      label: "Documents",
      content: <UserDocuments />,
      hide: false,
    },
    {
      label: "Disputes & Reports",
      content: <DisputeReports />,
      hide: false,
    },
    {
      label: "Privileges",
      content: <Previlage />,
      hide: false,
    },
    {
      label: "Wallet",
      content: <Wallet />,
      hide: false,
    },
    {
      label: "Job History",
      content: <EngineerJobCatagory />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <div className="flex justify-between mt-4">
        <h1 className="font-semibold ">User Details</h1>
        <div className="flex gap-4">
          <Button
            variant="solid"
            className=""
            onClick={() =>
              navigate(`${absoluteUrls.admin.home.manage_engineer}`)
            }
          >
            Back
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <FormProvider {...methods}>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
            <AdminTabComponent
              tabs={tabs}
              defaultActiveTab="Basic Information"
            />
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
