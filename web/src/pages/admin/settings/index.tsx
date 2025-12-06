import AdminTabComponent from "@/shared/components/AdminTabComponent";
import Commission from "./Commission";

/**
 * Settings page for admin. Presents settings in tabbed sections using
 * `AdminTabComponent`. Currently includes the `Commission` tab where
 * commission values can be configured.
 *
 * @component
 * @returns {JSX.Element} Settings page with tabbed settings sections.
 */
export default function Settings() {
  const tabs = [
    {
      label: "Commission",
      content: <Commission />,
      hide: false,
    },
  ];

  return (
    <div className="w-full h-full px-4">
      <div className="flex justify-between">
        <p className="mt-2 mb-6 font-semibold">Settings</p>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
        <AdminTabComponent tabs={tabs} defaultActiveTab="Commission" />
      </div>
    </div>
  );
}
