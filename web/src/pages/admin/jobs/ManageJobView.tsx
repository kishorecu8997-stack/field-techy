import AdminTabComponent from "@/shared/components/AdminTabComponent";
import JobDetails from "./components/JobDetails";
import ProcessTracking from "./components/ProcessTracking";
import Payment from "./components/Payment";
import { Button } from "@/shared/components/commonUI/Buttons";
import { useNavigate } from "react-router-dom";

/*
 * ManageJobView Component
 *
 * Displays a management dashboard for job details, process tracking, and payment.
 * Uses AdminTabComponent for tabbed UI and react-router for navigation.
 *
 * @component
 * @example
 * <ManageJobView />
 * */
const ManageJobView = () => {
  const navigate = useNavigate();
  const tabs = [
    {
      label: "Job Details",
      content: <JobDetails />,
      hide: false,
    },
    {
      label: "Process Tracking",
      content: <ProcessTracking />,
      hide: false,
    },
    {
      label: "Payment",
      content: <Payment />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Job Details</p>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Job Details" />
      </div>
    </div>
  );
};

export default ManageJobView;
