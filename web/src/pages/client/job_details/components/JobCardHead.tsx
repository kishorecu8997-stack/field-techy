import React from 'react';

interface JobCardProps {
  title: string;
  hours: number;
  client: string;
  status: string;
  onApprove: () => void;
  onRequestRevision: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  title, 
  hours, 
  client, 
  status, 
  onApprove, 
  onRequestRevision 
}) => {
  return (
    <div className="w-full max-w-4xl p-6 rounded-xl bg-emerald-900 dark:bg-emerald-800 text-white shadow-lg transition-colors duration-300">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <div className="flex items-center gap-2 text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{hours} Hours of Jobs</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Client:</span> {client}
          </div>
        </div>
        
        {/* Status and menu */}
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-md bg-white text-emerald-900 font-medium text-sm">
            {status}
          </span>
          <button className="p-2 text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button 
          onClick={onApprove}
          className="px-6 py-3 rounded-lg bg-emerald-100 text-emerald-900 font-medium hover:bg-emerald-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 dark:focus:ring-offset-emerald-900"
        >
          Approve Work
        </button>
        <button 
          onClick={onRequestRevision}
          className="px-6 py-3 rounded-lg bg-white text-emerald-900 font-medium hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 dark:focus:ring-offset-emerald-900"
        >
          Request Revision
        </button>
      </div>
    </div>
  );
};

export default JobCard;