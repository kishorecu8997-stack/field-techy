import React from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import BasicInformation from "./BasicInformation";
import WalletTab from "./WalletTab";
import DocumentView from "./DocumentView";
import JobHistory from "./job_history/JobHistory";
import { toast } from "react-toastify";
import { useAdminGetClientByUserId } from "@/shared/apiServices/admin/adminOpenApiService";
import type { CompanyInfo } from "../../types";

/**
 * ClientViewForm component displays detailed information about a client (Corporate or Home).
 * It fetches data using useAdminGetClientByUserId and organizes it into a tabbed interface.
 */
const ClientViewForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();

  const { data: clientData, isLoading } = useAdminGetClientByUserId(userId || "", {
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  // Map API response to CompanyInfo
  const companyInfo: CompanyInfo = {
    profileImage: clientData?.profilePicture?.url,
    clientType: clientData?.clientType,
    companyName: clientData?.companyName || clientData?.name || "N/A",
    businessType: clientData?.businessTypeName || "N/A",
    country: String(clientData?.countryId || "N/A"), // IDs for now
    postalCode: clientData?.postalCode || "N/A",
    contactPersonName: clientData?.personName || clientData?.name || "N/A",
    industry: String(clientData?.industryId || "N/A"),
    state: String(clientData?.stateId || "N/A"),
    taxDocument: clientData?.documentType || "N/A",
    phoneNumber: clientData?.phoneNumber || "N/A",
    address: clientData?.address || "N/A",
    city: String(clientData?.cityId || "N/A"),
    documentNumber: clientData?.documentNumber || "N/A",
  };

  const tabs = [
    {
      label: "Basic Information",
      content: <BasicInformation {...companyInfo} />,
    },
    {
      label: "Job History",
      content: <JobHistory clientEmail={clientData?.email} />,
    },
    {
      label: "Wallet",
      content: <WalletTab />,
    },
    {
      label: "Documents",
      content: <DocumentView 
        govIdDoc={clientData?.govIdDoc?.url} 
        certificateDoc={clientData?.certificateDoc?.url} 
      />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-800 dark:text-white">Client Details</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="w-fit bg-gradient-to-r from-teal-800 to-teal-900 text-white py-1 rounded-md hover:opacity-90 transition shadow-sm"
            onClick={() =>
              toast.success("Client has been blocked successfully!")
            }
          >
            Block Client
          </Button>
          <Button
            variant="solid"
            className="border-gray-300"
            onClick={() => navigate(absoluteUrls.admin.home.manage_client)}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="p-3 h-full w-full flex flex-1 overflow-hidden flex-col bg-neutral-100 dark:bg-gray-900  rounded-md gap-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Basic Information" />
      </div>
    </div>
  );
};

export default ClientViewForm;
