import React, { useState, useEffect } from "react";
import loginHistoryData from "../../../../dummy_data/engineer_profile/loginHistoryMock.json";
import { Button } from "@/shared/components/commonUI/Buttons";

const ITEMS_PER_PAGE = 10;

/**
 * LoginHistory component displaying user's recent login activities with pagination.
 */
const LoginHistory: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState(loginHistoryData);
  const [currentPage, setCurrentPage] = useState(1);

  // In a real app, fetch login history from an API so i am leaving it like this for now
  useEffect(() => {
    // Example: fetch('/api/login-history').then(setLoginHistory);
  }, []);

  const totalPages = Math.ceil(loginHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = loginHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Login History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Date</th>
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Time</th>
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Device</th>
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">IP</th>
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Location</th>
              <th className="px-1 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((login) => (
              <tr key={login.id} className="border-t border-gray-200 dark:border-gray-600">
                <td className="px-1 py-1 text-gray-900 dark:text-gray-100">{login.date}</td>
                <td className="px-1 py-1 text-gray-900 dark:text-gray-100">{login.time}</td>
                <td className="px-1 py-1 text-gray-900 dark:text-gray-100">{login.device}</td>
                <td className="px-1 py-1 text-gray-900 dark:text-gray-100">{login.ip}</td>
                <td className="px-1 py-1 text-gray-900 dark:text-gray-100">{login.location}</td>
                <td className={`px-1 py-1 ${login.status === "Successful" ? "text-green-600" : "text-red-600"}`}>
                  {login.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-xs"
          >
            Prev
          </Button>
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginHistory;