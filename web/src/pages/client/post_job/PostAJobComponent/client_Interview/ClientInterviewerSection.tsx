import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export interface InfoItem {
  label: string;
  value: string;
}

export interface SectionData {
  title: string;
  items: InfoItem[];
  onEdit?: () => void; // only for this section
  onDelete?: () => void; // only for this section
}

interface MultiCardProps {
  sections: SectionData[];
  addAction?: React.ReactNode; // common add component
  title?: string;
  disabled?: boolean;
}

const ClientInterviewerSection: React.FC<MultiCardProps> = ({
  sections,
  addAction,
  title,
  disabled,
}) => {
  return (
    <div className="space-y-2 border border-gray-200 rounded-2xl shadow p-4 bg-white w-full">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-md">{title}</h2>
      </div>
      {sections.map((section, idx) => (
        <div
          key={idx}
          className="border border-gray-300 rounded-2xl shadow p-4 bg-white w-full space-y-3"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-md">
              {section.title} {idx + 1}
            </h2>
            {!disabled && (
              <div className="flex gap-3 cursor-pointer">
                {section.onEdit && (
                  <div onClick={section.onEdit}>
                    <FiEdit2 className="text-lg hover:text-teal-700" />
                  </div>
                )}
                {section.onDelete && (
                  <div onClick={section.onDelete}>
                    <FiTrash2 className="text-lg hover:text-red-600" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2">
            {section.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="text-gray-800 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!disabled && addAction && <div className="flex justify-end">{addAction}</div>}
    </div>
  );
};

export default ClientInterviewerSection;
