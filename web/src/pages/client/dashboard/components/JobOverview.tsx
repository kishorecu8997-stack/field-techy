import { VscBriefcase } from "react-icons/vsc";
import type { JobOverview } from "../type";
import { NavLink } from "react-router-dom";
import React from "react";
import { absoluteUrls } from "@/config/urls";

/**
 * `JobOverviewCard` is a component that displays a summary of job statistics.
 * It shows a title, a count, and an optional button to view related jobs.
 * The card's appearance is customizable through color props.
 * @param {JobOverview} props The properties for the component.
 * @param {string} props.title The title of the job overview (e.g., "Completed Jobs").
 * @param {number} props.count The numerical value for the overview (e.g., number of jobs).
 * @param {string} props.color The background color class for the card.
 * @param {string} props.textColor The text color class for the card.
 * @param {string} props.buttonColor The background color class for the button.
 * @param {boolean} props.buttonShow A boolean to determine if the "View Jobs" button is displayed.
 */
const JobOverviewCard: React.FC<JobOverview> = ({
  title,
  count,
  color,
  textColor,
  buttonColor,
  buttonShow,
}) => {
  return (
    <div
      className={`rounded-xl p-5 ${color} ${textColor} shadow-md transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{<VscBriefcase />}</span>
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${buttonColor} ${
                  textColor === "text-white" ? "text-white" : "text-gray-800"
                } transition-colors duration-200 hover:opacity-90 cursor-pointer`}
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
