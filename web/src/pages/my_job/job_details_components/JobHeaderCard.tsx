import { JOB_STATUSES } from "@/pages/serch_result/types";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import type { JobHeaderCardProps } from "../types";

/**
 * Displays the main header card for a job with title, client, duration, type, and status.
 */
const JobHeaderCard: React.FC<JobHeaderCardProps> = ({
  title,
  client,
  duration,
  type,
  status,
}) => {
  return (
    <div className="bg-teal-800 text-white p-5 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        <span className="bg-gray-300 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium justify-items-center h-fit justify-center items-center text-gray-900">
          {type}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm justify-start items-start">
        <span className="flex items-center gap-1">🕒 {duration}</span>
        <span>Client: {client}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 h-fit justify-end">
        <span className="flex rounded-full text-sm font-medium h-fit justify-end items-end w-fit">
          {status === JOB_STATUSES.inprogress ? (
            <div className="flex flex-wrap gap-2 w-fit">
              <Button className="bg-teal-800 text-white px-6 py-2 rounded-full font-medium border border-gray-300">
                Upload Logs
              </Button>
              <Button className="bg-teal-800 text-white px-6 py-2 rounded-full font-medium border border-gray-300">
                Submit work
              </Button>
            </div>
          ) : status === JOB_STATUSES.applied ? (
            <div className="flex flex-wrap gap-2 w-fit items-center">
              <FaRegCheckCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg">Job Applied</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 w-fit items-center">
              <FaRegCheckCircle className="text-green-500 w-6 h-6" />
              <span className="text-lg">Job Completed</span>
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default JobHeaderCard;
