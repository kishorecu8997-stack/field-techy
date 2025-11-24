import React from 'react';
import type { JobCardProps } from '../types';
import { Button } from '@/shared/components/commonUI/Buttons';
import { IoMdTime } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";


/**
 * A card component that displays the header details of a job, including title, hours,
 * client, and status, along with action buttons to approve or request revision.
 *
 * @param {JobCardProps} props - The props for the component.
 * @returns {React.ReactElement} A React functional component that renders the job card header.
 */
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
          <div className="flex items-center gap-2 text-sm mb-2 underline">
            <IoMdTime className="h-5 w-5" />
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
          <Button className="p-2 text-white hover:text-gray-200 focus:outline-none">
            <IoEllipsisVertical className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button 
          onClick={onApprove}
          className="px-6 py-3 rounded-lg bg-emerald-100 text-emerald-900 font-medium hover:bg-emerald-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 dark:focus:ring-offset-emerald-900"
        >
          Approve Work
        </Button>
        <Button 
          onClick={onRequestRevision}
          className="px-6 py-3 rounded-lg bg-white text-emerald-900 font-medium hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 dark:focus:ring-offset-emerald-900"
        >
          Request Revision
        </Button>
      </div>
    </div>
  );
};

export default JobCard;