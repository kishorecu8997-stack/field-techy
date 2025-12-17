import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import Pagination from "@/shared/components/commonUI/pagination/Pagination";

interface Session {
  id: string;
  startTime: string;
  device: string;
}

interface ActiveSessionsProps {
  itemsPerPage?: number;
}

const ActiveSessions: React.FC<ActiveSessionsProps> = ({
  itemsPerPage = 4,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Placeholder for API call - replace with real API fetch when available
        // const response = await fetch('/api/sessions'); const data = await response.json();
        const mockSessions: Session[] = [
          {
            id: "1",
            startTime: "2025-12-16T10:00:00Z",
            device: "Desktop - Windows",
          },
          { id: "2", startTime: "2025-12-16T11:30:00Z", device: "iPhone 15" },
          { id: "3", startTime: "2025-12-16T12:00:00Z", device: "iPad Pro" },
          { id: "4", startTime: "2025-12-16T13:15:00Z", device: "MacBook Air" },
          { id: "5", startTime: "2025-12-16T14:45:00Z", device: "Android TV" },
          {
            id: "6",
            startTime: "2025-12-16T15:30:00Z",
            device: "Linux Desktop",
          },
          {
            id: "7",
            startTime: "2025-12-16T16:00:00Z",
            device: "Chrome on Android",
          },
        ];
        setSessions(mockSessions);
      } catch (err) {
        setError("Failed to load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSessions = useMemo(
    () => sessions.slice(startIndex, startIndex + itemsPerPage),
    [sessions, startIndex, itemsPerPage]
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSelect = (id: string) => {
    setSelectedSessions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    if (selectedSessions.length === 0) return;
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    const updatedSessions = sessions.filter(
      (s) => !selectedSessions.includes(s.id)
    );
    setSessions(updatedSessions);
    setSelectedSessions([]);
    setShowConfirm(false);

    const newTotalPages = Math.ceil(updatedSessions.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto font-sans text-center">
        <p>Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto font-sans text-center text-red-600">
        <p>{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Where You're Logged In
        </h1>
        <p className="text-gray-500 text-sm">
          Check the devices where you are currently logged in and secure your
          account.
        </p>
      </header>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No active sessions found.</p>
        </div>
      ) : (
        <>
          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            {currentSessions.map((session) => {
              const isSelected = selectedSessions.includes(session.id);
              return (
                <div
                  key={session.id}
                  className={`flex items-center p-4 border rounded-lg transition-colors duration-200 ${
                    isSelected
                      ? "bg-blue-50 border-blue-400"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="mr-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(session.id)}
                      aria-label={`Select session on ${session.device}`}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 leading-tight mb-1">
                      {session.device}
                    </div>
                    <div className="text-xs text-gray-500">
                      Logged in:{" "}
                      {new Date(session.startTime).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    <div className="text-xs text-blue-600 mt-1 font-medium">
                      {session.id === "1" ? "This Device" : "Active Now"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="border-t border-gray-200 pt-5 flex flex-col items-center gap-4">
            <Button
              onClick={handleLogout}
              disabled={selectedSessions.length === 0}
              className={`w-full max-w-xs py-3 px-6 rounded-md font-bold transition-colors ${
                selectedSessions.length > 0
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Logout{" "}
              {selectedSessions.length > 0
                ? `(${selectedSessions.length})`
                : ""}
            </Button>

            {totalPages > 1 && (
              <div className="w-full flex justify-center py-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">
              Are you sure you want to logout {selectedSessions.length} selected
              session(s)?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Logout
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
