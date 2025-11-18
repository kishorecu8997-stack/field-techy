import { adminEngineer, adminClient } from "@/dummy_data/adminDashboard";
import StateCard from "@/shared/components/AdminCard";
import AdminTabComponent from "@/shared/components/AdminTabComponent";

/**
 * Users dashboard section.
 *
 * Presents user-related statistics split into tabbed sections for
 * 'Engineer' and 'Client'. Each tab displays a grid of `StatCard`
 * components driven by the `adminEngineer` and `adminClient` data sources.
 *
 * @component
 * @returns {JSX.Element} Tabbed user statistics section.
 */
export default function Users() {
  /**
   * Tab configuration for Engineer and Client user statistics.
   */
  const tabs = [
    {
      label: "Engineer",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {adminEngineer.map((s, i) => (
            <StateCard
              key={i}
              title={s.title}
              value={s.value}
              alt="Engineer"
              className=""
            />
          ))}
        </div>
      ),
      hide: false,
    },
    {
      label: "Client",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {adminClient.map((s, i) => (
            <StateCard
              key={i}
              title={s.title}
              value={s.value}
              alt="Client"
              className=""
            />
          ))}
        </div>
      ),
      hide: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
      <AdminTabComponent tabs={tabs} defaultActiveTab="Engineer" />
    </div>
  );
}
