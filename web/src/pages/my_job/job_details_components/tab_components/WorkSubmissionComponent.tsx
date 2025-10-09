import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import type { WorkInfoItem, WorkSubmissionComponentProps } from "../../types";


/**
 * A reusable component displaying a complete work submission panel.
 * Includes technician info, job details, file attachment, notes, signature, approval, payment status, and user review.
 * Styled with Tailwind CSS to match provided UI design.
 *
 * @param {WorkSubmissionComponentProps} props - The props for the WorkSubmissionComponent
 * @returns {JSX.Element} Rendered work submission panel
 */
const WorkSubmissionComponent: React.FC<{
  workSubmissions: WorkSubmissionComponentProps;
}> = ({ workSubmissions }) => {
  const {
    name,
    workDates,
    startTime,
    endTime,
    onsiteTask,
    location,
    fileName,
    notes,
    signatureUrl,
    isApproved,
    paymentStatus,
    reviewerName,
    rating,
    reviewComment,
  } = workSubmissions;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const infoItems: WorkInfoItem[] = [
    { label: "Name", value: name },
    { label: "Date(s) of Work", value: workDates },
    { label: "Work Start Date & Time", value: startTime },
    { label: "Work End Date & Time", value: endTime },
    {
      label: "Task Carried out at the site?",
      value: onsiteTask ? "Yes" : "No",
    },
  ];

  return (
    <div className="p-4 ">
      <div className="bg-white rounded-xl shadow-sm  p-6 mb-4 dark:bg-gray-700">
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap min-w-[180px]">
                {item.label}:
              </span>
              <span className="text-gray-900 flex-1 break-words dark:text-gray-300">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
        <h4 className="font-semibold mb-2">Location of Job</h4>
        <p className="text-gray-700 dark:text-gray-300">{location}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Completed Task File</h4>
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md w-fit">
          <span className="text-sm text-gray-700 flex justify-center items-center text-center gap-2">
            <FaFileAlt />
            {fileName}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Technician Notes</h4>
        <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">{notes}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Technician Signature</h4>
        <div className="flex items-center  justify-between">
        {signatureUrl ? (
          <div className="w-fit">
            <img
              src={signatureUrl}
              alt="Signature"
              className="max-w-full h-auto border border-gray-300 rounded"
              />
          </div>
        ) : (
          <div className="h-16 bg-gray-100 flex items-center justify-center text-gray-500 italic">
            [Signature Placeholder]
          </div>
        )}
        {isApproved && (
          <div
          className="mt-2 px-2 py-1 bg-teal-800 text-white rounded font-medium hover:bg-teal-700 w-fit"
          >
            Approved
          </div>
        )}
        </div>
      </div>

      <div className=" mb-4 p-4 bg-gray-100 rounded-lg flex items-start gap-3 dark:bg-gray-700">
        <div className="items-center gap-2 p-2 bg-gray-100 rounded-md w-fit">
          <IoMdCheckmarkCircleOutline className="text-emerald-500 w-8 h-8 " />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-300">Payment Released</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{paymentStatus}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
            <img
              src="/avatar-placeholder.jpg"
              alt="Reviewer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-400">{reviewerName}</h4>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(rating)}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
              {reviewComment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSubmissionComponent;
