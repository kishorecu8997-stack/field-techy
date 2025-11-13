import React from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import BasicInformation from "./BasicInformation";
import { ClientViewData } from "@/dummy_data/ClientViewData";
import WalletTab from "./WalletTab";
import DocumentView from "./DocumentView";
import JobHistory from "./job_history/JobHistory";


/**
 * HomeClientViewForm component displays detailed information about a home client.
 * It uses a tabbed interface to organize client data into several sections:
 * Basic Information, Job History, Wallet, and Documents.
 *
 * - The "Basic Information" tab shows general client details via the `<BasicInformation />` component.
 * - The "Job History" tab displays the client's past and present jobs using the `<JobHistory />` component.
 * - The "Wallet" tab shows financial details through the `<WalletTab />` component.
 * - The "Documents" tab displays client-related documents via the `<DocumentView />` component.
 *
 * @component
 * @returns {JSX.Element} The rendered HomeClientViewForm component.
 */
const HomeClientViewForm: React.FC = () => {
  const tabs = [
    {
      label: "Basic Information",
      content: (
        <BasicInformation {...ClientViewData} />
      ),
    },
    {
      label: "Job History",
      content: <JobHistory />,
    },
    {
      label: "Wallet",
      content: <WalletTab />,
    },
    {
      label: "Documents",
      content: <DocumentView />,
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold ">Client Details</h1>
        <div className="flex items-center gap-2"> 
        <Button
          variant="primary"
          size="sm"
          className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          onClick={() => alert("Client Blocked")}
        >
          Block Client
        </Button>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(`${absoluteUrls.admin.home.manage_client}`)}
        >
          Back
        </Button>
        </div>
      </div>

      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Basic Information" />
      </div>
    </div>
  );
};

export default HomeClientViewForm;