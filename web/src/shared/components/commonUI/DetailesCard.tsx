import React from "react";
import { Pencil, Trash2Icon } from "lucide-react";

// Reusable DetailsCard component
export type DetailsCardProps = {
  /**
   * Details can be an array of { label, value } entries or a plain object.
   */
  details?: Array<{ label: string; value: React.ReactNode }> | Record<string, any>;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export const EducationCard: React.FC<DetailsCardProps> = ({
  details = [],
  onEdit,
  onDelete,
  className = "",
}) => {
  // Normalize details into an array of { label, value }
  const items: Array<{ label: string; value: React.ReactNode }> = Array.isArray(details)
    ? (details as Array<{ label: string; value: React.ReactNode }>)
    : Object.entries(details || {}).map(([k, v]) => ({
        label: String(k),
        value: v,
      }));

  // Try to pick a sensible header (look for keys containing 'level' or 'education')
  const headerValue =
    items.find((it) => /level|education/i.test(String(it.label)))?.value || "";

  const humanize = (s: string) =>
    String(s)
      .replace(/[_\-]/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm ${className}`}
      style={{ maxWidth: 400 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-semibold text-base text-gray-800">{headerValue}</span>
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
        {items.map((it, idx) => (
          <div key={idx}>
            <span className="font-semibold">{humanize(it.label)}:</span>{" "}
            <span className="font-normal">{it.value ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};