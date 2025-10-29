import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  type EmploymentType,
  type WorkLocationType,
  employmentTypeOptions,
  workLocationTypeOptions,
} from "./constants";

/**
 * Represents a single work experience entry.
 * @interface WorkExperience
 */
export interface WorkExperience {
  id: string;
  title: string;
  employer: string;
  workLocationType: WorkLocationType;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
}

/**
 * Props for the WorkExperienceList component.
 * @interface WorkExperienceListProps
 */
interface WorkExperienceListProps {
  title: string;
  items: WorkExperience[];
  onAddAction?: () => void;
  onEditAction?: (id: string) => void;
  onDeleteAction?: (id: string) => void;
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
 * Creates a lookup map from a value to its label from an options array.
 * @param {Array<{value: string, label: string}>} options - The options array.
 * @returns {Map<string, string>} A map where keys are option values and values are option labels.
 */
const createLabelMap = (
  options: Readonly<Array<{ value: string; label: string }>>
) => {
  return new Map(options.map((opt) => [opt.value, opt.label]));
};
const employmentTypeLabelMap = createLabelMap(employmentTypeOptions);
const workLocationTypeLabelMap = createLabelMap(workLocationTypeOptions);

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
                    {workLocationTypeLabelMap.get(item.workLocationType)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Employment Type:</span>{" "}
                    {employmentTypeLabelMap.get(item.employmentType)}
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
