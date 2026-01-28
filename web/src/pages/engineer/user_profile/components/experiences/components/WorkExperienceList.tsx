import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  employmentTypeOptions,
  workLocationTypeOptions,
  designationOptions,
} from "./constants";

/**
 * Props for the WorkExperienceList component.
 */
interface WorkExperienceListProps {
  title: string;
  items?: any[];
  onAddAction?: () => void;
  onEditAction?: (id: string) => void;
  onDeleteAction?: (id: string) => void;
}

/**
 * Formats a date string into a more readable "DD Mon YYYY" format.
 */
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Creates a lookup map from a value to its label from an options array.
 */
const createLabelMap = (
  options: Readonly<Array<{ value: string; label: string }>>,
) => {
  return new Map(options.map((opt) => [opt.value, opt.label]));
};
const employmentTypeLabelMap = createLabelMap(employmentTypeOptions);
const workLocationTypeLabelMap = createLabelMap(workLocationTypeOptions);
const designationLabelMap = createLabelMap(designationOptions);

/**
 * Renders a styled list of work experiences.
 */
export const WorkExperienceList: React.FC<WorkExperienceListProps> = ({
  title,
  items,
  onAddAction,
  onEditAction,
  onDeleteAction,
}) => {
  const experiences = items || [];

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

      <div className="overflow-y-auto space-y-2">
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No records yet.</p>
        ) : (
          <div className="space-y-4">
            {experiences.map((item, index) => (
              <div key={item.id || index} className="bg-white px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {designationLabelMap.get(String(item.designation || "")) ||
                        item.designation || "Unknown Designation"}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-500">
                    <button
                      onClick={() => onEditAction?.(String(item.id || ""))}
                      className="hover:text-blue-600 transition-colors"
                      aria-label="Edit"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => onDeleteAction?.(String(item.id || ""))}
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
                    <span className="font-medium">Work Location:</span>{" "}
                    {workLocationTypeLabelMap.get(
                      String(item.workLocationId || ""),
                    ) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Employment Type:</span>{" "}
                    {employmentTypeLabelMap.get(String(item.employmentTypeId || "")) ||
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Duration:</span>{" "}
                    {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : "Present"}
                  </p>
                </div>

                {index < experiences.length - 1 && (
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
