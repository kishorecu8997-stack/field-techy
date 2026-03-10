import StateCard from "@/shared/components/AdminCard";
import AdminTabComponent from "@/shared/components/AdminTabComponent";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

/**
 * Users dashboard section.
 *
 * Presents user-related statistics split into tabbed sections for
 * 'Engineer' and 'Client'. Each tab displays a grid of `StatCard`
 * components driven by the dynamic data. Shows a message if no data exists.
 *
 * @component
 * @returns {JSX.Element} Tabbed user statistics section.
 */
export default function Users({
  engineerData,
  clientData,
  isLoading,
  isError,
}: {
  engineerData?: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  clientData?: {
    total: number;
    active: number;
    blocked: number;
  };
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-12 flex items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-12 text-center text-red-600 font-medium">
        Failed to load user statistics
      </div>
    );
  }
  const displayEngineer = engineerData
    ? [
        { title: "Total Engineer", value: engineerData.total.toLocaleString() },
        {
          title: "Total Active Engineer",
          value: engineerData.active.toLocaleString(),
        },
        {
          title: "Total Inactive Engineer",
          value: engineerData.inactive.toLocaleString(),
        },
        {
          title: "Suspended Accounts",
          value: engineerData.suspended.toLocaleString(),
        },
      ]
    : null;

  const displayClient = clientData
    ? [
        { title: "Total Client", value: clientData.total.toLocaleString() },
        {
          title: "Total Active Client",
          value: clientData.active.toLocaleString(),
        },
        {
          title: "Blocked Accounts",
          value: clientData.blocked.toLocaleString(),
        },
      ]
    : null;

  const tabs = [
    {
      label: "Engineer",
      content: displayEngineer ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayEngineer.map((s, i) => (
            <StateCard
              key={i}
              title={s.title}
              value={s.value}
              alt="Engineer"
              className=""
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 font-medium">
          No data available
        </div>
      ),
      hide: false,
    },
    {
      label: "Client",
      content: displayClient ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayClient.map((s, i) => (
            <StateCard
              key={i}
              title={s.title}
              value={s.value}
              alt="Client"
              className=""
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 font-medium">
          No data available
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
