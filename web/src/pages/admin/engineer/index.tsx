import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PendingRequest from "./components/PendingRequest";
import ActiveUser from "./components/ActiveUser";
import SuspendedUser from "./components/SuspendedUser";
import InactiveUser from "./components/InactiveUser";
import BlockedUser from "./components/BlockedUser";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import AllUsers from "./components/AllUsers";

export default function ManageEngineer() {
  const navigate = useNavigate();
  const activeTabStorageKey = "admin.manage_engineer.active_tab";
  const tabs = useMemo(
    () => [
      {
        label: "All Users",
        content: <AllUsers />,
        hide: false,
      },
      {
        label: "Pending Requests",
        content: <PendingRequest />,
        hide: false,
      },
      {
        label: "Active Users",
        content: <ActiveUser />,
        hide: false,
      },
      {
        label: "Inactive Users",
        content: <InactiveUser />,
        hide: false,
      },
      {
        label: "Suspended Users",
        content: <SuspendedUser />,
        hide: false,
      },
      {
        label: "Blocked Users",
        content: <BlockedUser />,
        hide: false,
      },
    ],
    [],
  );

  const visibleTabLabels = useMemo(
    () => tabs.filter((tab) => !tab.hide).map((tab) => tab.label),
    [tabs],
  );

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "All Users";
    const savedTab = window.sessionStorage.getItem(activeTabStorageKey);
    if (savedTab && visibleTabLabels.includes(savedTab)) return savedTab;
    return "All Users";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!visibleTabLabels.includes(activeTab)) {
      setActiveTab("All Users");
      return;
    }
    window.sessionStorage.setItem(activeTabStorageKey, activeTab);
  }, [activeTab, activeTabStorageKey, visibleTabLabels]);

  return (
    <div className="w-full h-full flex flex-col p-3 gap-3 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center px-1">
        <h1 className="font-semibold text-gray-800 dark:text-white">Manage Engineers</h1>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white"
            onClick={() =>
              navigate(absoluteUrls.admin.home.manage_engineer_add)
            }
          >
            Add Engineer
          </Button>
          <Button variant="solid" className="">
            Export CSV
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <AdminTabComponent
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}
