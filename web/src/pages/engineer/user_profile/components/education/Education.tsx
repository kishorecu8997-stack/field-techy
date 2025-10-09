import React from "react";
import educationData from "@/dummyData/education.json";
import DrawerHeader from "@/shared/components/DrawerHeader";
import { NavLink } from "react-router-dom";
import { Pencil, Trash2Icon } from "lucide-react";

// Reusable EducationCard component
export type EducationCardProps = {
  level: string;
  course: string;
  university: string;
  major: string;
  year: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export const EducationCard: React.FC<EducationCardProps> = ({
  level,
  course,
  university,
  major,
  year,
  onEdit,
  onDelete,
  className = "",
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm ${className}`}
    style={{ maxWidth: 400 }}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="font-semibold text-base text-gray-800">{level}</span>
      <div className="flex gap-2">
        {onEdit && (
          <button
            className="text-gray-600 hover:text-teal-900"
            aria-label="Edit"
            onClick={onEdit}
          >
            <Pencil size={16} />
          </button>
        )}
        {onDelete && (
          <button
            className="text-gray-600 hover:text-red-600"
            aria-label="Delete"
            onClick={onDelete}
          >
            <Trash2Icon size={16} />
          </button>
        )}
      </div>
    </div>
    <div className="text-sm text-gray-700 space-y-2">
      <div>
        <span className="font-semibold">Course:</span>{" "}
        <span className="font-normal">{course}</span>
      </div>
      <div>
        <span className="font-semibold">University:</span>{" "}
        <span className="font-normal">{university}</span>
      </div>
      <div>
        <span className="font-semibold">Major Subject:</span>{" "}
        <span className="font-normal">{major}</span>
      </div>
      <div>
        <span className="font-semibold">Passing Year:</span>{" "}
        <span className="font-normal">{year}</span>
      </div>
    </div>
  </div>
);

// Import education data from dummyData
interface DrawerMenuProps {
  /** Callback when a menu item is clicked */
  onMenuItemClick: (key: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}
const Education: React.FC<DrawerMenuProps> = ({ onMenuItemClick, onClose }) => {
  return (
    <>
      {/* Header */}
      <DrawerHeader title="Personal Information" onClose={onClose} />
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg text-gray-800">Education</span>
          <NavLink
            to="#"
            className="text-teal-700 hover:underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              onMenuItemClick(`addEducation`);
            }}
          >
            + Add Education
          </NavLink>
        </div>
        {educationData.education.map((item: any, idx: number) => (
          <EducationCard
            key={idx}
            {...item}
            onDelete={() => alert(`Delete education at index ${idx}`)}
            onEdit={() => onMenuItemClick(`editEducation`)}
          />
        ))}
      </div>
    </>
  );
};

export default Education;
