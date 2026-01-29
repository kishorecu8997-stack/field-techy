import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface EducationItem {
  id: string;
  educationLevel?: string | null;
  course?: string | null;
  university?: string | null;
  majorSubject?: string | null;
  passingYear?: number | null;
}

interface EducationListProps {
  title: string;
  items?: EducationItem[];
  onAddAction?: () => void;
  onEditAction?: (id: string) => void;
  onDeleteAction?: (id: string) => void;
}

const EducationList: React.FC<EducationListProps> = ({
  title,
  items = [],
  onAddAction,
  onEditAction,
  onDeleteAction,
}) => {
  return (
    <div className="rounded-lg p-4 shadow-sm h-fit">
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
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No records yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white px-4 py-3 rounded-lg shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.educationLevel || "Untitled Education"}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-500">
                    <button
                      onClick={() => onEditAction?.(item.id)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDeleteAction?.(item.id)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Level:</span>{" "}
                    {item.educationLevel || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Course:</span>{" "}
                    {item.course || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">University:</span>{" "}
                    {item.university || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Major:</span>{" "}
                    {item.majorSubject || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {item.passingYear || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationList;
