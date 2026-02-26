import React from "react";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import BasicInformation from "./BasicInformation";
import WalletTab from "./WalletTab";
import DocumentView from "./DocumentView";
import JobHistory from "./job_history/JobHistory";
import { useAdminGetClientByUserId } from "@/shared/apiServices/admin/adminOpenApiService";
import { useForm } from "react-hook-form";
import BlockClient from "../BlockClient";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import type { BlockClientForm, CompanyInfo } from "../../types";

/**
 * ClientViewForm component displays detailed information about a client (Corporate or Home).
 * It fetches data using useAdminGetClientByUserId and organizes it into a tabbed interface.
 */
const ClientViewForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const [isBlockPopupOpen, setIsBlockPopupOpen] = React.useState(false);

  const blockFormMethods = useForm<BlockClientForm>({
    defaultValues: { reason: "" },
  });

  const { data: clientData, isLoading } = useAdminGetClientByUserId(
    userId || "",
    {
      enabled: !!userId,
    },
  );

  const parsedUserId = Number(userId);
  const isValidUserId = !!userId && !isNaN(parsedUserId) && parsedUserId > 0;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  if (!isValidUserId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-800 rounded-md p-6">
        <div className="text-red-500 text-lg font-medium">
          Invalid Client ID
        </div>
        <p className="text-gray-500">
          The client identifier is missing or invalid. Please go back and try
          again.
        </p>
        <Button onClick={() => navigate(absoluteUrls.admin.home.manage_client)}>
          Back to Manage Clients
        </Button>
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
      content: <JobHistory userId={parsedUserId} />,
    },
    {
      label: "Wallet",
      content: (
        <WalletTab userId={parsedUserId} walletBalance={clientData?.balance} />
      ),
    },
    {
      label: "Documents",
      content: (
        <DocumentView
          govIdDoc={clientData?.govIdDoc?.url}
          certificateDoc={clientData?.certificateDoc?.url}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-800 dark:text-white">
          Client Details
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="w-fit bg-gradient-to-r from-teal-800 to-teal-900 text-white py-1 rounded-md hover:opacity-90 transition shadow-sm"
            onClick={() => setIsBlockPopupOpen(true)}
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

      <FormContainer methods={blockFormMethods} onSubmit={() => {}}>
        <BlockClient
          userId={parsedUserId}
          isBlockClient={isBlockPopupOpen}
          setIsBlockClient={setIsBlockPopupOpen}
          onSuccess={() => {
            navigate(absoluteUrls.admin.home.manage_client);
          }}
        />
      </FormContainer>
    </div>
  );
};

export default ClientViewForm;
