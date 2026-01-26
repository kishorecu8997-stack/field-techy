import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface ChipsCardProps {
  title: string;
  chips: string[];
  onAddAction?: () => void;
  onEditAction?: () => void; // No index — edits the whole section
  onDeleteAction?: () => void; // Optional: delete entire section or clear
}

const ChipsCard: React.FC<ChipsCardProps> = ({
  title,
  chips,
  onAddAction,
  onEditAction,
  onDeleteAction,
}) => {
  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow border border-gray-200 dark:bg-gray-700 dark:border-gray-700">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {onAddAction && (
            <button
              onClick={onAddAction}
              className="text-sm text-teal-700 hover:underline font-light transition-colors cursor-pointer flex items-center gap-1 dark:text-teal-300 dark:hover:text-teal-200"
            >
              <span>+</span> Add {title.slice(0, -1)}
            </button>
          )}
        </div>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="flex justify-end items-center mb-4 gap-2">
        {onEditAction && (
          <button
            onClick={onEditAction}
            className="text-gray-300 hover:text-blue-600 transition-colors cursor-pointer dark:hover:text-blue-400"
            aria-label={`Edit`}
          >
            <FaRegEdit />
          </button>
        )}
        {onDeleteAction && (
          <button
            onClick={onDeleteAction}
            className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            aria-label={`Delete`}
          >
            <RiDeleteBin6Line />
          </button>
        )}
      </div>

      {chips.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No {title.toLowerCase()} yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <span
              key={index}
              className="bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-sm text-sm text-gray-800 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipsCard;
