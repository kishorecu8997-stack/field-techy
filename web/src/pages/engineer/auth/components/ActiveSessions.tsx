import React, { useState, useEffect } from 'react';
import { Button } from "@/shared/components/commonUI/Buttons";
import Pagination from "@/shared/components/commonUI/pagination/Pagination";

interface Session {
  id: string;
  user: string;
  startTime: string;
  device: string;
}

const ActiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([ ]);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchSessions = async () => {
      const mockSessions: Session[] = [
        { id: '1', user: 'Current User', startTime: '2025-12-16T10:00:00Z', device: 'Desktop - Windows' },
        { id: '2', user: 'Current User', startTime: '2025-12-16T11:30:00Z', device: 'iPhone 15' },
        { id: '3', user: 'Current User', startTime: '2025-12-16T12:00:00Z', device: 'iPad Pro' },
        { id: '4', user: 'Current User', startTime: '2025-12-16T13:15:00Z', device: 'MacBook Air' },
        { id: '5', user: 'Current User', startTime: '2025-12-16T14:45:00Z', device: 'Android TV' },
        { id: '6', user: 'Current User', startTime: '2025-12-16T15:30:00Z', device: 'Linux Desktop' },
        { id: '7', user: 'Current User', startTime: '2025-12-16T16:00:00Z', device: 'Chrome on Android' },
      ];
      setSessions(mockSessions);
    };
    fetchSessions();
  }, []);

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSessions = sessions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSelect = (id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    const updatedSessions = sessions.filter(s => !selectedSessions.includes(s.id));
    setSessions(updatedSessions);
    setSelectedSessions([]);
    
    const newTotalPages = Math.ceil(updatedSessions.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  };

  return (  
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Where You're Logged In</h1>
        <p className="text-gray-500 text-sm">
          Check the devices where you are currently logged in and secure your account.
        </p>
      </header>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        {currentSessions.map((session) => {
          const isSelected = selectedSessions.includes(session.id);
          return (
            <div
              key={session.id}
              onClick={() => handleSelect(session.id)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="mr-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // Controlled by div click
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-gray-900 leading-tight mb-1">
                  {session.device}
                </div>
                <div className="text-xs text-gray-500">
                  Logged in: {new Date(session.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  {session.id === '1' ? 'This Device' : 'Active Now'}
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
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Logout {selectedSessions.length > 0 ? `(${selectedSessions.length})` : ''}
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
    </div>
  );
};

export default ActiveSessions;