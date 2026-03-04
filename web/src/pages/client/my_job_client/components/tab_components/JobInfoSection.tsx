import React from "react";
import type { JobInfoSectionProps, paymentTermsProps } from "../../types";
import Proposal from "@/shared/components/Proposal";
import { IoAttach } from "react-icons/io5";

/**
 * Displays detailed job information including creation date, start date, tasks, and files.
 */
const JobInfoSection: React.FC<{
  jobInfo: JobInfoSectionProps;
  payInfo: paymentTermsProps;
}> = ({ jobInfo, payInfo }) => {
  const { jobTitle, terms, files } = jobInfo;

  return (
    <div className="">
      <Proposal
        jobTitle={jobTitle}
        terms={terms}
        element={
          <div className="">
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
      <div className="px-4">
        <div className="bg-gray-100 p-5 rounded-md dark:bg-gray-700">
          <h4 className="font-semibold mb-2">{payInfo.title}</h4>
          <h4 className="font-semibold ">${payInfo.amount}</h4>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {payInfo.priceType} Price
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobInfoSection;
