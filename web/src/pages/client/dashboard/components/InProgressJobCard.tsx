import type { InProgressJob } from "../type";
import { IoMdTime } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoConstructOutline,
} from "react-icons/io5";
import React from "react";

const InProgressJobCard: React.FC<InProgressJob> = ({
  title,
  date,
  location,
  duration,
  serviceType,
  price,
  engineers,
  engineerAvatars,
  WorkLocationType,
}) => {
  // Determine work mode color
  const getWorkModeColor = (workMode: string) => {
    return workMode === "On Site"
      ? "bg-blue-600 text-white"
      : "bg-indigo-600 text-white";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getWorkModeColor(
            WorkLocationType
          )}`}
        >
          {WorkLocationType}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center  text-sm text-gray-600 dark:text-gray-300">
          <IoMdTime className="w-4 h-4 mr-2" />
          {date}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoLocationOutline className="w-4 h-4 mr-2" />
          {location}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoCalendarOutline className="w-4 h-4 mr-2" />
          {duration}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <IoConstructOutline className="w-4 h-4 mr-2" />
          Service Type: {serviceType}
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <RiMoneyDollarCircleLine className="w-4 h-4 mr-2" />
          {price}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <div className="flex -space-x-2">
          {engineerAvatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="Engineer"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
            {engineers}
          </div>
        </div>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          Engineers
        </span>
      </div>
    </div>
  );
};

export default InProgressJobCard;
