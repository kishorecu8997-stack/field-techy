import { useForm, FormProvider } from "react-hook-form";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import Pagination from "@/shared/components/commonUI/pagination/Pagination";
import { CheckboxField } from "@/shared/components/commonUI/inputs/CheckBoxField";

interface Session {
  id: string;
  startTime: string;
  device: string;
  lastActivity?: string;
  browser?: string;
  location?: string;
  isCurrent?: boolean;
}

interface ActiveSessionsProps {
  itemsPerPage?: number;
  onLogout?: (sessionIds: string[]) => void;
}

/**
 * ActiveSessions Component
 * Displays a list of active sessions for the user, with the ability to log out of selected sessions.
 * It uses the `react-hook-form` library for form handling and state management.
 * 
 * @param param0
 * @returns
 */
const ActiveSessions: React.FC<ActiveSessionsProps> = ({
  itemsPerPage = 4,
  onLogout,
}) => {
  const methods = useForm({ defaultValues: {} });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockSessions: Session[] = [
        {
          id: "1",
          startTime: "2025-12-16T10:00:00Z",
          device: "Desktop - Windows",
          isCurrent: false,
        },
        {
          id: "2",
          startTime: "2025-12-16T11:30:00Z",
          device: "iPhone 15",
          isCurrent: true,
        },
        {
          id: "3",
          startTime: "2025-12-16T12:00:00Z",
          device: "iPad Pro",
          isCurrent: false,
        },
        {
          id: "4",
          startTime: "2025-12-16T13:15:00Z",
          device: "MacBook Air",
          isCurrent: false,
        },
        {
          id: "5",
          startTime: "2025-12-16T14:45:00Z",
          device: "Android TV",
          isCurrent: false,
        },
        {
          id: "6",
          startTime: "2025-12-16T15:30:00Z",
          device: "Linux Desktop",
          isCurrent: false,
        },
        {
          id: "7",
          startTime: "2025-12-16T16:00:00Z",
          device: "Chrome on Android",
          isCurrent: false,
        },
      ];

      await new Promise((res) => setTimeout(res, 800));
      setSessions(mockSessions);
    } catch (err) {
      setError("Failed to load sessions. Please try again.");
      console.error("Failed to load active sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Reset selection on session refetch or page change
  useEffect(() => {
    setSelectedSessions([]);
  }, [sessions, currentPage]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showConfirm) {
        setShowConfirm(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirm]);

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSessions = useMemo(
    () => sessions.slice(startIndex, startIndex + itemsPerPage),
    [sessions, startIndex, itemsPerPage]
  );

  const toggleSelect = (id: string) => {
    setSelectedSessions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const confirmLogout = async () => {
    if (selectedSessions.length === 0) {
      setShowConfirm(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (onLogout) {
        await Promise.resolve(onLogout(selectedSessions));
      }
      const updatedSessions = sessions.filter(
        (s) => !selectedSessions.includes(s.id)
      );
      setSessions(updatedSessions);
      setSelectedSessions([]);
      const newTotalPages = Math.ceil(updatedSessions.length / itemsPerPage);
      setCurrentPage(
        newTotalPages === 0 ? 1 : Math.min(currentPage, newTotalPages)
      );
      setShowConfirm(false);
    } catch {
      setError("Failed to log out selected sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    if (selectedSessions.length === 0) return;
    setShowConfirm(true);
  };

  if (loading)
    return (
      <div className="p-6 max-w-3xl mx-auto font-sans text-center flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-3xl mx-auto font-sans text-center text-red-600">
        <p>{error}</p>
        <Button
          onClick={fetchSessions}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Retry
        </Button>
      </div>
    );

  return (
    <FormProvider {...methods}>
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
          <div className="grid grid-cols-1 gap-4 mb-6">
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
                    <CheckboxField
                      name={`session_${session.id}`}
                      options={[{ label: "", value: session.id }]}
                      inputClassName="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                      wrapperClassName=""
                      direction="horizontal"
                      disabled={false}
                      rules={{ onChange: () => toggleSelect(session.id) }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
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
                      {session.isCurrent ? "This Device" : "Active Now"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Footer */}
        {sessions.length > 0 && (
          <div className="border-t border-gray-200 pt-5 flex flex-col items-center gap-4">
            <Button
              onClick={handleLogoutClick}
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
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setShowConfirm(false)}
            ></div>

            {/* Modal content */}
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
              <p className="mb-4">
                Are you sure you want to logout {selectedSessions.length}{" "}
                selected session(s)?
              </p>
              <div className="flex gap-4 justify-end">
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
    </FormProvider>
  );
};

export default ActiveSessions;
