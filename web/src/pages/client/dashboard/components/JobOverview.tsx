import { VscBriefcase } from "react-icons/vsc";
import type { JobOverview } from "../type";
import { NavLink } from "react-router-dom";
import React from "react";
import { absoluteUrls } from "@/config/urls";

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
