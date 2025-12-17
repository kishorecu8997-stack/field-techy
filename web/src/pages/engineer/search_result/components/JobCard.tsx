import { icons } from "@/config/icons";
import React, { useState } from "react";
import { BiDollar, BiTimeFive, BiUser, BiWorld } from "react-icons/bi";
import { IoLocationSharp, IoHelpCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import type { Job } from "../types";
import { scrollToTop } from "@/utils";
import { getExperienceLevel, JOB_STATUSES } from "../types";
import { calculateMatchScore } from "@/utils/matchCalculator";
import jobSkillsData from "@/dummy_data/jobSkills.json";
import toolsData from "@/dummy_data/tools.json";

// Reusable Badge
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: "green" | "blue" | "purple" | "yellow" | "teal" | "gray";
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
      <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-6">
            <IoHelpCircleOutline className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
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

          <button
            onClick={onClose}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{
  job: Job;
  showBookmark?: boolean;
  navigateToJob?: string;
}> = ({ job, showBookmark = true, navigateToJob = "#" }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [showWhyPopover, setShowWhyPopover] = useState(false);
  // Simulate user profile using dummy data
  const userSkills = jobSkillsData.jobSkills.map(
    (s: { label: string }) => s.label
  );
  const userTools = toolsData.tools.map((t: { label: string }) => t.label);
  const userProfileItems = [...userSkills, ...userTools];
  const jobRequirements = [...(job.skills || []), ...(job.tools || [])];
  const matchScore = calculateMatchScore(jobRequirements, userProfileItems);
  const experienceLabel = job.experience
    ? `${getExperienceLevel(job.experience)} • ${job.experience}+ years`
    : "Experience not specified";

  return (
    <>
      <Link
        to={navigateToJob}
        onClick={scrollToTop}
        className="block p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm sm:p-1 mb-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                  {job.title || "Untitled Job"}
                </h3>
                {/* Match Score Ring */}
                {matchScore > 0 && <MatchScoreRing score={matchScore} />}
                {/* Separate "Why recommended?" Button */}
                {matchScore > 0 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowWhyPopover(true);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Why is this job recommended?"
                  >
                    <IoHelpCircleOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
                {job.ServiceType && (
                  <Badge
                    variant={
                      job.ServiceType === "Dedicated"
                        ? "green"
                        : job.ServiceType === "Dispatch"
                        ? "blue"
                        : job.ServiceType === "Scheduled"
                        ? "purple"
                        : "gray"
                    }
                  >
                    {job.ServiceType}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                {job.client && (
                  <span className="font-medium">
                    Client:{" "}
                    <span className="text-gray-900 dark:text-white">
                      {job.client}
                    </span>
                  </span>
                )}
                {job.time && (
                  <>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <div className="flex items-center gap-1.5">
                      <BiTimeFive className="w-4 h-4 text-gray-500" />
                      <span>{job.time}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-end gap-3">
              {job.status && (
                <Badge
                  variant={
                    job.status === "new"
                      ? "green"
                      : job.status === "offer"
                      ? "blue"
                      : job.status === "applied"
                      ? "yellow"
                      : job.status === "inprogress"
                      ? "teal"
                      : job.status === "completed"
                      ? "gray"
                      : "gray"
                  }
                >
                  {JOB_STATUSES[job.status] || job.status}
                </Badge>
              )}

              {showBookmark && (
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsBookmarked(!isBookmarked);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Bookmark job"
                  >
                    {isBookmarked ? (
                      <icons.bookmarkFilled className="w-5 h-5 text-green-600" />
                    ) : (
                      <icons.bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>

                  <span className="whitespace-nowrap font-medium">
                    {job.postedTime || "Just now"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills & Tools */}
          {(job.skills?.length || job.tools?.length) && (
            <div className="mb-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">
                      Skills:
                    </span>
                    {job.skills.slice(0, 5).map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {job.tools && job.tools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">
                      Tools:
                    </span>
                    {job.tools.slice(0, 3).map((tool, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                    {job.tools.length > 3 && (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        +{job.tools.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
            {job.description || "No description available."}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-7 text-sm border-t border-gray-100 dark:border-gray-700 pt-2">
            {job.place && (
              <div className="flex items-center gap-2">
                <IoLocationSharp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {job.place}
                </span>
              </div>
            )}

            {(job.salary || job.pay) && (
              <div className="flex items-center gap-2">
                <BiDollar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {job.salary || job.pay}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <BiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {experienceLabel}
              </span>
            </div>

            {job.languages && (
              <div className="flex items-center gap-2">
                <BiWorld className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {job.languages}
                </span>
              </div>
            )}
            {/* POC Section */}
            {job.poc && (
              <div className="flex items-center gap-3 ml-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-[9px] font-semibold text-gray-900 dark:text-white">
                    {" "}
                    {/* changed from text-sm to text-xs */}
                    Point of Contact
                  </p>
                  <p className="text-[9px] text-gray-700 dark:text-gray-300">
                    {" "}
                    {/* changed from text-sm to text-xs */}
                    {job.poc.name}
                    {job.poc.role && (
                      <span className="text-gray-500"> • {job.poc.role}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Why Recommended Popover */}
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
