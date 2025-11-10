import AdminTabComponent from "@/shared/components/AdminTabComponent";
import PersonalDetails from "./PersonalDetails";
import ChangePassword from "./ChangePassword";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

/**
 * Profile component renders the admin profile page with tabbed navigation for personal details and password change.
 * Utilizes AdminTabComponent for tabbed UI and react-router for navigation.
 *
 * @component
 */
export default function Profile() {
  /**
   * React Router navigation function.
   */
  const navigate = useNavigate();

  /**
   * Tab configuration for profile sections.
   */
  const tabs = [
    {
      label: "Personal Details",
      content: <PersonalDetails />,
      hide: false,
    },
    {
      label: "Change Password",
      content: <ChangePassword />,
      hide: false,
    },
  ];
  return (
    <div className="w-full p-4 h-full">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">My Profile</p>
        <Button
          variant="solid"
          className=""
          onClick={() => navigate(`${absoluteUrls.admin.home.dashbaord}`)}
        >
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Personal Details" />
      </div>
    </div>
  );
}
