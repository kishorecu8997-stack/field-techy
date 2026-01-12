import { getMdGridColsClass } from "@/utils/styles";

export interface InfoItem {
  label: string;
  value?: string | number | null;
}

export interface InfoGridProps {
  items: InfoItem[];
  columns?: number; // default = 3
  className?: string;
}

/**
 * InfoGrid Component
 *
 * Displays a list of labeled data items in a flexible, responsive grid layout.
 * Automatically adjusts the number of columns based on screen size or the `columns` prop.
 *
 * @component
 * @param {InfoItem[]} items - Array of information objects to display.
 * @param {number} [columns=3] - Number of columns to render (default is 3).
 * @param {string} [className] - Optional additional CSS classes.
 * @returns {JSX.Element} The rendered grid of labeled information items.
 *
 * @example
 * const info = [
 *   { label: "Client", value: "Acme Corp" },
 *   { label: "Region", value: "EMEA" },
 *   { label: "Rate Type", value: "Master" }
 * ];
 *
 * <InfoGrid items={info} columns={2} />
 */
export const InfoGrid: React.FC<InfoGridProps> = ({
  items,
  columns = 3,
  className = "",
}) => {
  return (
    <div
      className={`grid gap-x-8 gap-y-4 sm:gap-y-6 md:gap-x-10 lg:gap-x-16 
  grid-cols-1 sm:grid-cols-2 ${getMdGridColsClass(columns)} ${className}`}
    >
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
            {item.label}:
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1 truncate">
            {item.value ?? "-"}
          </span>
        </div>
      ))}
    </div>
  );
};
