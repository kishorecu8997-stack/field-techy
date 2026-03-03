import React from "react";
import type { JobInfoSectionProps } from "../../types";
import Proposal from "@/shared/components/Proposal";
import { IoAttach } from "react-icons/io5";

/**
 * Displays detailed job information including creation date, start date, tasks, and files.
 */
const JobInfoSection: React.FC<{
  jobInfo: JobInfoSectionProps;
}> = ({ jobInfo }) => {
  const { jobTitle, terms, files = [] } = jobInfo;

  return (
    <div className="">
      <Proposal
        jobTitle={jobTitle}
        terms={terms}
        element={
          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <IoAttach className="w-4 h-4" />
                  {file.name}
                </a>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default JobInfoSection;
