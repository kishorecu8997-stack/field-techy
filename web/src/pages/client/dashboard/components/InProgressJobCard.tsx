import React from "react";
import { IoMdTime } from "react-icons/io";
import {
  IoCalendarOutline,
  IoConstructOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useLookupData } from "@/shared/apiServices/client/clientOpenApiService";
import { useMemo } from "react";
import type { Job } from "../../search_result/types";

/**
 * Helper component to display job location with proper fallback
 */
const JobLocationDisplay: React.FC<{
  countryId?: number;
  stateId?: number;
  cityId?: number;
  workLocationName?: string | null;
  fallback?: string;
}> = ({ countryId, stateId, cityId, workLocationName, fallback }) => {
  const { data: countries } = useLookupData("countries");
  const { data: states } = useLookupData(
    "states",
    countryId ? String(countryId) : undefined,
  );
  const { data: cities } = useLookupData(
    "cities",
    stateId ? String(stateId) : undefined,
  );

  const countryName = useMemo(
    () => countries?.find((c) => c.id === countryId)?.name,
    [countries, countryId],
  );
  const stateName = useMemo(
    () => states?.find((s) => s.id === stateId)?.name,
    [states, stateId],
  );
  const cityName = useMemo(
    () => cities?.find((c) => c.id === cityId)?.name,
    [cities, cityId],
  );

  if (workLocationName) {
    return <span>{workLocationName}</span>;
  }

  if (!countryId && !cityId) return <span>{fallback || "N/A"}</span>;

  const parts = [];
  if (cityName) parts.push(cityName);
  if (stateName) parts.push(stateName);
  else if (!cityName && cityId) parts.push(String(cityId));

  if (countryName) parts.push(countryName);

  if (parts.length === 0) {
    const idParts = [];
    if (cityId) idParts.push(cityId);
    if (countryId) idParts.push(countryId);
    return <span>{idParts.join(", ")}</span>;
  }

  return <span>{parts.join(", ")}</span>;
};

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

  return (
    <Link to={navigateToJob}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {job.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium ${getWorkModeColor(
              job.type || "",
            )}`}
          >
            {job.type}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <IoMdTime className="w-4 h-4 mr-2 flex-shrink-0" />
            {job.startDate}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <IoLocationOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            <JobLocationDisplay
              countryId={job.countryId}
              stateId={job.stateId}
              cityId={job.cityId}
              workLocationName={job.workLocationName}
              fallback={job.location}
            />
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
            {job.pay}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <div className="flex -space-x-2">
            {job.engineerAvatars?.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Engineer ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
              +{job.engineers}
            </div>
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            Engineers
          </span>
        </div>
      </div>
    </Link>
  );
};

export default InProgressJobCard;
