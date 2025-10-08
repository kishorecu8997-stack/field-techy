import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export interface WorkSubmissionComponentProps {
  name: string;
  workDates: string;
  startTime: string;
  endTime: string;
  onsiteTask: boolean;
  location: string;
  fileName: string;
  notes: string;
  signatureUrl?: string;
  isApproved: boolean;
  paymentStatus: string;
  reviewerName: string;
  rating: number;
  reviewComment: string;
}

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

  return (
    <div className="p-4 ">
      <div className="mb-4 flex flex-col gap-1">
        <p>
          <strong className="text-gray-700 ">Name :</strong> {name}
        </p>
        <p>
           <strong className="text-gray-700">Date(s) of Work :</strong> {workDates}
        </p>
        <p>
          <strong className="text-gray-700">Work Start Date & Time :</strong> {startTime}
        </p>
        <p>
          <strong className="text-gray-700">Work End Date & Time :</strong> {endTime}
        </p>
        <p>
           <strong className="text-gray-700">Task Carried out at the site? </strong>{" "}
          {onsiteTask ? "Yes" : "No"}
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Location of Job</h4>
        <p className="text-gray-700">{location}</p>
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
        <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Technician Signature</h4>
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
          <Button size="sm" className="mt-2 px-2 py-1 bg-teal-800 text-white rounded font-medium hover:bg-teal-700">
            Approved
          </Button>
        )}
      </div>

      <div className=" mb-4 p-4 bg-gray-100 rounded-lg flex items-start gap-3">
        <div className="items-center gap-2 p-2 bg-gray-100 rounded-md w-fit">
          <IoMdCheckmarkCircleOutline className="text-emerald-500 w-8 h-8 " />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Payment Released</h4>
          <p className="text-sm text-gray-600">{paymentStatus}</p>
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
            <h4 className="font-semibold text-gray-800">{reviewerName}</h4>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(rating)}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {reviewComment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSubmissionComponent;
