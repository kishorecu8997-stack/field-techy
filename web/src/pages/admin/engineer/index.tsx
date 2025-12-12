import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";
import PendingRequest from "./components/PendingRequest";
import ActiveUser from "./components/ActiveUser";
import SuspendedUser from "./components/SuspendedUser";
import InactiveUser from "./components/InactiveUser";
import BlockedUser from "./components/BlockedUser";
import AdminTabComponent from "@/shared/components/AdminTabComponent";

export default function ManageEngineer() {
  const navigate = useNavigate();
  const tabs = [
    {
      label: "Pending Request",
      content: <PendingRequest />,
      hide: false,
    },
    {
      label: "Active User",
      content: <ActiveUser />,
      hide: false,
    },
    {
      label: "Inactive User",
      content: <InactiveUser />,
      hide: false,
    },
    {
      label: "Suspended User",
      content: <SuspendedUser />,
      hide: false,
    },
    {
      label: "Blocked User",
      content: <BlockedUser />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <div className="flex justify-between my-4">
        <h1 className="font-semibold">Engineers</h1>
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
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab={"Pending Request"} />
      </div>
    </div>
  );
}
