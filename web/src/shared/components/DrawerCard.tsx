import formatKeyToLabel from "@/utils/formatKeyToLabel";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

/**
 * GenericItem represents a flat object used by the drawer list.
 * Keys are string identifiers and values are primitives shown in the UI.
 * Using a Record keeps the component flexible across different list types
 * (education, employment, documents, etc.). Values are limited to
 * string | number for safe rendering via String(...).
 */
type GenericItem = Record<string, string | number>;

/**
 * Props for the DrawerCard component.
 *
 * @property title - Label shown in the header and used for the add button text.
 * @property items - Array of records to display. Each item should include an `id` key.
 * @property onAddAction - Optional callback invoked when the add button is clicked.
 * @property onEditAction - Optional callback invoked with the item id when edit is clicked.
 * @property onDeleteAction - Optional callback invoked with the item id when delete is clicked.
 */
interface DrawerCardProps {
  title: string;
  items: GenericItem[];
  onAddAction?: () => void;
  onEditAction?: (id: number) => void;
  onDeleteAction?: (id: number) => void;
}

/**
 * Keys that should not be displayed in the details area.
 * Currently hides `id` which is used for actions but not shown to users.
 */
const EXCLUDE_KEYS = ["id"];

/**
 * DrawerCard
 *
 * A small reusable card used inside profile drawers to render lists of flat
 * records (education, employment history, certifications, etc.). The
 * component derives displayable fields from the first item in the list and
 * renders each record with a lightweight header and action buttons.
 *
 * The component is intentionally presentation-focused and expects callers
 * to provide properly shaped `items` (including an `id` numeric field when
 * edit/delete callbacks are used).
 *
 * @param props - DrawerCardProps
 */
const DrawerCard: React.FC<DrawerCardProps> = ({
  title,
  items,
  onAddAction,
  onEditAction,
  onDeleteAction,
}) => {
  // Get display keys from the first item (if available)
  const displayKeys =
    items.length > 0
      ? Object.keys(items[0]).filter((key) => !EXCLUDE_KEYS.includes(key))
      : [];

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onAddAction}
          className="text-teal-700 hover:underline font-light transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>+</span> Add {title}
        </button>
      </div>

      <hr className="border-gray-200 mb-4" />

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No records yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id as number}>
              <div className="flex justify-between items-start mb-2">
                {/* Use the first display field as the title (e.g., level, position, name) */}
                <h3 className="font-medium text-gray-800">
                  {item[displayKeys[0]]}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditAction?.(item.id as number)}
                    className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                    aria-label="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => onDeleteAction?.(item.id as number)}
                    className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label="Delete"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                {displayKeys.map((key) => (
                  <p key={key}>
                    <strong>{formatKeyToLabel(key)}:</strong>{" "}
                    {String(item[key])}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrawerCard;
