import { icons } from "@/config/icons";
import { scrollToTop } from "@/utils";
import { getCurrencyFromStorage } from "@/utils/currency";
import React, { useState } from "react";
import { BiDollar, BiUser, BiWorld } from "react-icons/bi";
import { IoHelpCircleOutline, IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import {
  toggleSavedJob,
  isJobSaved,
  BOOKMARK_CHANGE_EVENT,
} from "@/utils/bookmarkUtils";
import { toast } from "react-toastify";
import jobSkillsData from "@/dummy_data/jobSkills.json";
import toolsData from "@/dummy_data/tools.json";
import { calculateMatchScore } from "@/utils/matchCalculator";
import { useMemo } from "react";
import { getExperienceLevel, JOB_STATUSES } from "../types";

// Reusable Badge
type BadgeVariant = "green" | "blue" | "purple" | "yellow" | "teal" | "gray";
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: BadgeVariant;
}> = ({ children, variant = "gray" }) => {
  const styles = {
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

// Match Score Ring (clean, no tooltip)
const MatchScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const getColorClass = (val: number) => {
    if (val >= 80) return "text-green-600 dark:text-green-400";
    if (val >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };
  const activeColor = getColorClass(score);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${score}% match score`}
      >
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${activeColor} transition-all duration-1000 ease-in-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            strokeLinecap: "round",
          }}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${activeColor}`}>
        {score}%
      </span>
    </div>
  );
};

// Why Recommended Popover Modal
const WhyRecommendedPopover: React.FC<{
  score: number;
  onClose: () => void;
}> = ({ score, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popover Card */}
      <div
        className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300 "
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-recommended-title"
      >
        {/* Close Button */}
        <div
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
             focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
             dark:focus-visible:ring-offset-gray-800"
          aria-label="Close"
        >
          <icons.close className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-6">
            <IoHelpCircleOutline className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>

          <h3
            className="text-xl font-bold text-gray-900 dark:text-white mb-3"
            id="why-recommended-title"
          >
            Why is this job recommended?
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            This job matches{" "}
            <span className="font-bold text-teal-600 dark:text-teal-400">
              {score}%
            </span>{" "}
            of your skills and tools. The higher the match score, the better
            this job aligns with your experience and expertise.
          </p>

          <div
            onClick={onClose}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors"
          >
            Got it
          </div>
        </div>
      </div>
    </div>
  );
};
// Extract once at module level
const USER_SKILLS = jobSkillsData.jobSkills.map((s) => s.label);
const USER_TOOLS = toolsData.tools.map((t) => t.label);

/**
 * JobCard
 *
 * Displays a summary view of a job posting, including key job details
 * and optional actions such as bookmarking and navigation.
 *
 * @param job - The job data object containing details like title, company,
 * location, and match score.
 * @param showBookmark - Whether to display the bookmark action (default: true).
 * @param navigateToJob - The URL or route used to navigate to the job detail page
 * (default: "#").
 */
const JobCard: React.FC<{
  job: Job;
  showBookmark?: boolean;
  navigateToJob?: string;
  onBookmarkChange?: () => void;
}> = ({ job, showBookmark = true, navigateToJob = "#" }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [showWhyPopover, setShowWhyPopover] = useState(false);

  const userSkills = USER_SKILLS;
  const userTools = USER_TOOLS;

  const matchScore = useMemo(() => {
    return calculateMatchScore(
      [...(job.skills || []), ...(job.tools || [])],
      [...userSkills, ...userTools]
    );
  }, [job.skills, job.tools, userSkills, userTools]);

  const STATUS_VARIANT_MAP = {
    new: "green",
    offer: "blue",
    applied: "yellow",
    inprogress: "teal",
    completed: "gray",
  } as const satisfies Record<
    "new" | "offer" | "applied" | "inprogress" | "completed",
    "green" | "blue" | "purple" | "yellow" | "teal" | "gray"
  >;

  return (
    <>
      <Link
        to={navigateToJob}
        onClick={scrollToTop}
        className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="min-w-0 flex-1">
            {/* Job title */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {job.title}
              </h3>

              {/* Right-aligned: Match score & help button */}
              <div className="flex items-center gap-2">
                {matchScore > 0 && <MatchScoreRing score={matchScore} />}
                {matchScore > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowWhyPopover(true);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Why is this job recommended?"
                  >
                    <IoHelpCircleOutline className="w-6 h-6 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Job metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-300">
              {job.client && (
                <span>
                  Client:{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {job.client}
                  </strong>
                </span>
              )}
              {job.time && <span>| {job.time}</span>}
              {job.status && (
                <Badge
                  variant={
                    STATUS_VARIANT_MAP[job.status] ??
                    (() => {
                      console.warn(`Unknown job status: ${job.status}`);
                      return "gray"; // fallback to a valid variant
                    })()
                  }
                >
                  {JOB_STATUSES[job.status] ?? job.status}
                </Badge>
              )}
              {job.time && <span>| {job.time}</span>}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* SKILLS & TOOLS */}
        {(job.skills?.length || job.tools?.length) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills?.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
              >
                {skill}
              </span>
            ))}
            {job.tools?.slice(0, 3).map((tool, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER BAR */}
        <div className="flex flex-wrap items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
          <div className="flex flex-wrap items-center gap-5">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <IoLocationSharp className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  {job.location}
                </span>
              </div>
            )}

            {(job.salary || job.pay) && (
              <div className="flex items-center gap-1.5">
                <BiDollar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  {job.salary || job.pay}
                </span>
              </div>
            )}

            {job.languages && (
              <div className="flex items-center gap-2">
                <BiWorld className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {job.languages}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {getExperienceLevel(job.experience)}
              </span>
            </div>
          </div>

          {/* BOOKMARK */}
          {showBookmark && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <icons.bookmarkFilled className="w-4 h-4 text-green-600" />
                ) : (
                  <icons.bookmark className="w-4 h-4" />
                )}
              </div>
              <span>{job.postedTime || "Just now"}</span>
            </div>
          )}

          {/* POC Section */}
          {job.poc && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  Point of Contact
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {job.poc.name}
                  {job.poc.role && (
                    <span className="text-gray-500"> • {job.poc.role}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </Link>

      {showWhyPopover && (
        <WhyRecommendedPopover
          score={matchScore}
          onClose={() => setShowWhyPopover(false)}
        />
      )}
    </>
  );
};

export default JobCard;
