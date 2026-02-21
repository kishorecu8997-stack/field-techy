import React, { useState } from "react";
import ClientList from "./tab_components/ClientList";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";
import Popup from "@/shared/components/Popup";
import ViewFileComponent from "./tab_components/ViewFileComponent";
import type { ManageClientProps } from "./types";
import { type ProfileFileType } from "@/shared/apiServices/commonOpenApiService";

/**
 * ManageClient Component
 *
 * This component serves as the main page for managing clients within the admin dashboard.
 * It utilizes a tabbed interface to separate and display "Corporate" and "Home" clients.
 * It also manages a shared popup for viewing client documents.
 *
 * @component
 * @returns {JSX.Element} The rendered ManageClient page with tabbed navigation.
 */
const ManageClient: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    client: ManageClientProps;
    type: ProfileFileType;
  } | null>(null);

  const handleViewDocument = (client: ManageClientProps, type: ProfileFileType) => {
    setSelectedFile({ client, type });
    setIsPreviewOpen(true);
  };

  /**
   * Defines the tabs for the AdminTabComponent, separating "Corporate" and "Home" clients.
   * Both tabs use the same consolidated ClientList component with different props.
   */
  const tabs = [
    {
      label: "Corporate Client",
      content: <ClientList clientType="corporate" onViewDocument={handleViewDocument} />,
    },
    {
      label: "Home Client",
      content: <ClientList clientType="home" onViewDocument={handleViewDocument} />,
    },
  ];

  const getFileUrl = () => {
    if (!selectedFile) return null;
    const { client, type } = selectedFile;
    switch (type) {
      case "govIdDoc":
        return client.govIdDoc?.url;
      case "certificateDoc":
        return client.certificateDoc?.url;
      case "profilePicture":
        return client.profilePicture?.url;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center px-1">
        <h1 className="font-semibold text-gray-800 dark:text-white">Manage Clients</h1>
        <Button
          variant="outline" 
          onClick={() => alert("Export CSV")}
          className="border-teal-700 text-teal-700 hover:bg-teal-50"
        >
          Export CSV
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Corporate Client" />
      </div>

      <Popup open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        {selectedFile && (
          <ViewFileComponent
            onClose={() => setIsPreviewOpen(false)}
            fileType={selectedFile.type}
            fileUrl={getFileUrl()}
              title={`${
              selectedFile.client.clientType === "corporate"
                ? selectedFile.client.companyName || selectedFile.client.name
                : selectedFile.client.name
            }'s`}
          />
        )}
      </Popup>
    </div>
  );
};

export default ManageClient;
