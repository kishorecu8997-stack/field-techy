import { VscBriefcase } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import React from "react";
import { absoluteUrls } from "@/config/urls";
import type { JobOverview } from "../type";

/**
 * `JobOverviewCard` is a component that displays a summary of job statistics.
 * It shows a title, a count, and an optional button to view related jobs.
 * The card's appearance is customizable through color props.
 * @param {JobOverview} props The properties for the component.
 * @param {number} props.id The unique identifier for the job overview.
 * @param {string} props.title The title of the job overview (e.g., "Completed Jobs").
 * @param {number} props.count The numerical value for the overview (e.g., number of jobs).
 * @param {string} props.status The status of the jobs being overviewed.
 * @param {boolean} props.buttonShow A boolean to determine if the "View Jobs" button is displayed.
 */

const JobOverviewCard: React.FC<JobOverview> = ({
  title,
  count,
  status,
  buttonShow,
}) => {
  const getStatusColors = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-100 dark:bg-green-900",
          textColor: "text-green-800 dark:text-green-200",
          buttonColor: "bg-green-200 dark:bg-green-800",
        };
      case "inprogress":
        return {
          color: "bg-emerald-800 dark:bg-emerald-200",
          textColor: "text-emerald-100 dark:text-emerald-900",
          buttonColor: "bg-emerald-200 dark:bg-emerald-800",
        };
      case "cancelled":
        return {
          color: "bg-gray-300 dark:bg-gray-600",
          textColor: "text-gray-800 dark:text-gray-200",
          buttonColor: "bg-gray-200 dark:bg-gray-800",
        };
      default: // Posted
        return {
          color: "bg-gray-100 dark:bg-gray-900",
          textColor: "text-gray-800 dark:text-gray-200",
          buttonColor: "bg-gray-200 dark:bg-gray-800",
        };
    }
  };

  const { color, textColor, buttonColor } = getStatusColors(status);

  return (
    <div
      className={`rounded-xl p-5 ${color} ${textColor} shadow-md transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">
              <VscBriefcase />
            </span>
            <span className="text-3xl font-bold">{count}</span>
          </div>
          <p className="text-sm opacity-80">{title}</p>
        </div>
        {buttonShow && (
          <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <NavLink
              to={absoluteUrls.client.home.my_jobs}
              className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
            >
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${buttonColor} text-white transition-colors duration-200 hover:text-white/70 cursor-pointer`}
              >
                View Jobs
              </button>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
};

export default JobOverviewCard;
