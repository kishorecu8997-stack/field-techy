import AdminTabComponent from "@/shared/components/AdminTabComponent";
import Commission from "./Commission";

export default function Settings() {
  const tabs = [
    {
      label: "Commission",
      content: <Commission />,
      hide: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Settings</p>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Commission" />
      </div>
    </div>
  );
}
