/**
 * @file WorkExperienceList.tsx
 * @description A component that renders a list of work experience entries.
 * It displays details for each experience and provides buttons for add, edit, and delete actions.
 */

import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

/**
 * Represents a single work experience entry.
 * @interface WorkExperience
 */
interface WorkExperience {
  /** The unique identifier for the experience. */
  id: number;
  /** The job title or designation. */
  title: string;
  /** The name of the employer. */
  employer: string;
  /** The type of work location (e.g., 'Remote', 'On-site'). */
  workLocationType: string;
  /** The type of employment (e.g., 'Full-time', 'Contract'). */
  employmentType: string;
  /** The start date of the employment, in string format. */
  startDate: string;
  /** The end date of the employment, in string format. */
  endDate: string;
}

/**
 * Props for the WorkExperienceList component.
 * @interface WorkExperienceListProps
 */
interface WorkExperienceListProps {
  /** The title to be displayed at the top of the list. */
  title: string;
  /** An array of work experience objects to display. */
  items: WorkExperience[];
  /** Optional callback function to handle adding a new experience. */
  onAddAction?: () => void;
  /** Optional callback function to handle editing an experience, identified by its ID. */
  onEditAction?: (id: number) => void;
  /** Optional callback function to handle deleting an experience, identified by its ID. */
  onDeleteAction?: (id: number) => void;
}

/**
 * Formats a date string into a more readable "DD Mon YYYY" format.
 * @param {string} dateStr - The date string to format (e.g., "2016-02-11").
 * @returns {string} The formatted date (e.g., "11 Feb 2016").
 */
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // e.g., 11-Feb-2016
};

/**
 * Renders a styled list of work experiences, each with details and action buttons.
 * @param {WorkExperienceListProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list of work experiences.
 */
export const WorkExperienceList: React.FC<WorkExperienceListProps> = ({
  title,
  items,
  onAddAction,
  onEditAction,
  onDeleteAction,
}) => {
  return (
    <div className=" rounded-lg p-4 shadow-sm h-fit">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onAddAction}
          className="text-teal-700 hover:underline font-light transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>+</span> Add {title}
        </button>
      </div>

      <hr className="border-gray-200 mb-4" />

      {/* Scrollable list wrapper: fixed max height with vertical scrollbar */}
      <div className="overflow-y-auto space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No records yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>                   
                  </div>

                  <div className="flex items-center space-x-3 text-gray-500">
                    <button
                      onClick={() => onEditAction?.(item.id)}
                      className="hover:text-blue-600 transition-colors"
                      aria-label="Edit"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => onDeleteAction?.(item.id)}
                      className="hover:text-red-600 transition-colors"
                      aria-label="Delete"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Employer:</span>{" "}
                    {item.employer}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Work Location Type:</span>{" "}
                    {item.workLocationType}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Employment Type:</span>{" "}
                    {item.employmentType}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Start Date:</span>{" "}
                    {formatDate(item.startDate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">End Date:</span>{" "}
                    {formatDate(item.endDate)}
                  </p>
                </div>

                {index < items.length - 1 && (
                  <hr className="border-t my-3 border-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceList;
