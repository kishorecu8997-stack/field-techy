import React from "react";
import { IoMdTime } from "react-icons/io";
import {
  IoCalendarOutline,
  IoConstructOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import type { Job } from "../../search_result/types";
import LocationDisplay from "@/shared/components/commonUI/LocationDisplay";

/**
 * `InProgressJobCard` is a component that displays a summary of an in-progress job.
 * It shows the job title, duration, location, and engineers involved.
 * The component supports both light and dark themes.
 * @param {InProgressJobCardProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered InProgressJobCard component.
 */
const InProgressJobCard: React.FC<{ job: Job; navigateToJob?: string }> = ({
  job,
  navigateToJob = "#",
}) => {
  const getWorkModeColor = (type: string) => {
    return type.toLowerCase() === "on-site"
      ? "bg-indigo-600 text-white"
      : "bg-blue-600 text-white";
  };

  const formatPrice = (price: string | number) => {
    if (price == null || price === "") return "";
    const priceStr = String(price);
    // Match currency symbol (like $, €, £, ₹ etc.) and the numeric part
    const match = priceStr.match(/^([^0-9]+)?(.*)$/);
    if (!match) return priceStr;
    
    const rawCurrencySymbol = match[1] || "";
     const currencySymbol = rawCurrencySymbol.trim();
    const numericPart = match[2] || "";
    
    // Add space between currency and number, normalizing any existing whitespace
    const withSpace = currencySymbol ? `${currencySymbol} ` : "";
    
    // Add comma separators to the numeric part
    const number = numericPart.replace(/[^0-9.]/g, "");
    const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return `${withSpace}${formattedNumber}`;
  };

  return (
    <Link to={navigateToJob}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mr-2">
            {job.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium flex-shrink-0 ${getWorkModeColor(
              job.type || "",
            )}`}
          >
            {job.type}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 min-w-0">
            <IoMdTime className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{job.startDate}</span>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 min-w-0">
            <IoLocationOutline className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div className="break-words">
              <LocationDisplay
                countryId={job.countryId}
                stateId={job.stateId}
                cityId={job.cityId}
                workLocationName={job.workLocationName}
                fallback={job.location}
              />
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <IoCalendarOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            {job.duration}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <IoConstructOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            Service Type: {job.serviceType}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <RiMoneyDollarCircleLine className="w-4 h-4 mr-2 flex-shrink-0" />
            {formatPrice(job.pay || "")}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          {job.engineerAvatars && job.engineerAvatars.length > 0 ? (
            <>
              <div className="flex -space-x-2">
                {job.engineerAvatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Engineer ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                  />
                ))}
                {job.engineers &&
                  Number(job.engineers) > job.engineerAvatars.length && (
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
                      +{Number(job.engineers) - job.engineerAvatars.length}
                    </div>
                  )}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {Number(job.engineers) > 0
                  ? `${job.engineers} Engineer${Number(job.engineers) > 1 ? "s" : ""}`
                  : "No Engineers"}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              No Engineers Assigned
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default InProgressJobCard;
