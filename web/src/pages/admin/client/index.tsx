import React from "react";
import CorporateClient from "./tab_components/CorporateClient";
import HomeClient from "./tab_components/HomeClient";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * ManageClient Component
 *
 * This component serves as the main page for managing clients within the admin dashboard.
 * It utilizes a tabbed interface to separate and display different categories of clients,
 * specifically "Corporate" and "Home" clients.
 *
 * - Renders a main title for the page.
 * - Implements `AdminTabComponent` to create a tabbed navigation.
 * - The "Corporate" tab displays the `<CorporateClient />` component.
 * - The "Home" tab displays the `<HomeClient />` component.
 * @component
 * @returns {JSX.Element} The rendered ManageClient page with tabbed navigation.
 */
const ManageClient: React.FC = () => {
  /**
   * Defines the tabs for the AdminTabComponent, separating "Corporate" and "Home" clients.
   * @type {{label: string, content: JSX.Element}[]}
   */
  const tabs = [
    {
      label: "Corporate",
      content: <CorporateClient />,
    },
    {
      label: "Home",
      content: <HomeClient />,
    },
  ];
  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold ">Manage Clients</h1>
        <Button
          variant="primary"
          size="sm"
          className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          onClick={() => alert("Export CSV")}
        >
          Export CSV
        </Button>
      </div>

      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-neutral-800 rounded-md gap-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Corporate" />
      </div>
    </div>
  );
};

export default ManageClient;
