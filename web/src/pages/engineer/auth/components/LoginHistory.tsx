import React, { useEffect } from "react";
import loginHistoryData from "../../../../dummy_data/engineer_profile/loginHistoryMock.json";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";

interface LoginHistoryItem {
  id: number;
  date: string;
  time: string;
  device: string;
  ip: string;
  location: string;
  status: string;
}

/**
 * LoginHistory component displaying user's recent login activities with pagination.
 */
const LoginHistory: React.FC = () => {
  const loginHistory: LoginHistoryItem[] = loginHistoryData;

  // In a real app, fetch login history from an API so I am leaving it like this for now
  useEffect(() => {
    // Example: fetch('/api/login-history').then(setLoginHistory);
  }, []);

  const columns: Column<LoginHistoryItem>[] = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "time",
      label: "Time",
    },
    {
      key: "device",
      label: "Device",
    },
    {
      key: "ip",
      label: "IP",
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "status",
      label: "Status",
      renderCell: (row) => (
        <span
          className={
            row.status === "Successful" ? "text-green-600" : "text-red-600"
          }
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Login History
      </h2>
      <CustomTable
        columns={columns}
        data={loginHistory}
        initialPageSize={10}
        showPagination={true}
      />
    </div>
  );
};

export default LoginHistory;
