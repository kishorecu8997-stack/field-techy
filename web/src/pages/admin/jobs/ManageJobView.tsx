import AdminTabComponent from "@/shared/components/AdminTabComponent";
import JobDetails from "./components/JobDetails";
import ProcessTracking from "./components/ProcessTracking";
import Payment from "./components/Payment";

const ManageJobView = () => {
  const tabs = [
    {
      label: "Contact Support",
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
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Contact Support" />
      </div>
    </div>
  );
};

export default ManageJobView;
