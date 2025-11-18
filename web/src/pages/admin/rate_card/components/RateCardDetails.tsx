import React from "react";
import type { InfoGridProps } from "../types";
import { getMdGridColsClass } from "@/utils/styles";

/**
 * RateCardDetails Component
 *
 * Displays a read-only summary of rate card information such as
 * rate type, client names, project, region, and country.
 *
 * Uses the `InfoGrid` component to render data in a responsive grid layout.
 *
 * @component
 * @returns {JSX.Element} The rendered RateCardDetails section.
 *
 * @example
 * // Example usage:
 * <RateCardDetails />
 */
export default function RateCardDetails() {
  const infoData = [
    { label: "Rate Card Type", value: "Client" },
    { label: "Client Names", value: "Client1, Client2" },
    { label: "Project", value: "Project1" },
    { label: "Region", value: "Region1" },
    { label: "Country", value: "Country1" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm">
      <InfoGrid items={infoData} columns={3} />
    </div>
  );
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
const InfoGrid: React.FC<InfoGridProps> = ({
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
