import { icons } from "@/config/icons";
import { getDurationString, scrollToTop } from "@/utils";
import {
  BOOKMARK_CHANGE_EVENT,
  isJobSaved,
  toggleSavedJob,
} from "@/utils/bookmarkUtils";
import { calculateMatchScore } from "@/utils/matchCalculator";
import React, { useEffect, useMemo, useState } from "react";
import { BiDollar, BiUser } from "react-icons/bi";
import { IoHelpCircleOutline, IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import type { JobItem } from "../../home/types";
import { getExperienceLevel, JOB_STATUSES } from "../types";
import { Badge } from "./BadgeVariant";

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
        className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-recommended-title"
      >
        {/* Close Button */}
        <div
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
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
 * @param userSkills - User's skills for match score calculation.
 * @param userTools - User's tools for match score calculation.
 */
const JobCard: React.FC<{
  job: JobItem;
  showBookmark?: boolean;
  navigateToJob?: string;
  onBookmarkChange?: () => void;
  userSkills?: string[];
  userTools?: string[];
}> = ({
  job,
  showBookmark = true,
  navigateToJob = "#",
  userSkills = [],
  userTools = [],
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isJobSaved(job.id));
  const [showWhyPopover, setShowWhyPopover] = useState(false);
  const { address: resolvedAddress } = useReverseGeocoding(job.location);

  const jobData = useMemo(() => {
    const clientName =
      typeof job.client === "string"
        ? job.client
        : job.client?.companyName || "-";

    return {
      id: job.id,
      title: (job as any).jobTitle || (job as any).title || "",
      clientName,
      location: job.location,
      salary: job.salary || (job as any).pay || "-",
      status: job.status,
      skills: job.skills,
      tools: job.tools,
      description: (job as any).jobDescription || (job as any).description,
      postedTime: job.postedTime,
      experience: job.experience,
      duration: (job as any).jobDuration || (job as any).duration,
      projectDeadline: (job as any).projectDeadline,
      startDate: job.startDate as string,
    };
  }, [job]);

  const matchScore = useMemo(() => {
    return calculateMatchScore(
      [...(jobData.skills || []), ...(jobData.tools || [])],
      [...userSkills, ...userTools],
    );
  }, [jobData.skills, jobData.tools, userSkills, userTools]);

  // Sync bookmark state on mount and when job.id changes
  useEffect(() => {
    if (jobData.id) {
      setIsBookmarked(isJobSaved(jobData.id));
    }
  }, [jobData.id]);

  // Listen for bookmark changes
  useEffect(() => {
    const handleBookmarkChange = () => {
      if (job.id) {
        setIsBookmarked(isJobSaved(job.id));
      }
    };
    window.addEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);
    return () => {
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, handleBookmarkChange);
    };
  }, [job.id]);

  // Handle bookmark toggle
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!job.id) return;
    const wasBookmarked = isBookmarked;
    toggleSavedJob(job);
    setIsBookmarked(!wasBookmarked);

    if (!wasBookmarked) {
      toast.success("Job saved successfully");
    } else {
      toast.error("Job removed from saved");
    }
  };

  const STATUS_VARIANT_MAP = {
    new: "green",
    offer: "blue",
    applied: "yellow",
    inprogress: "teal",
    completed: "gray",
    notified: "purple",
    unallocated: "yellow",
    partiallyAssigned: "amber",
    assigned: "teal",
    selected: "blue",
    hold: "red",
    draft: "gray",
    canceled: "rose",
    escalationInProgress: "pink",
    workInProgress: "teal",
    closed: "gray",
  } as const;

  const getDuration = getDurationString({
    startDateStr: job.startDate as string,
    endDateStr: job.projectDeadline as string,
  });

  return (
    <>
      <Link
        id="recommendedJobs"
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
                {jobData.title}
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
              {jobData.clientName && (
                <span>
                  Client:{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {jobData.clientName}
                  </strong>
                </span>
              )}
              {jobData.duration && <span>| {jobData.duration}</span>}
              {jobData.status && (
                <Badge
                  variant={
                    STATUS_VARIANT_MAP[
                      job.status as keyof typeof STATUS_VARIANT_MAP
                    ] ?? "gray"
                  }
                >
                  {JOB_STATUSES[job.status as keyof typeof JOB_STATUSES] ??
                    job.status}
                </Badge>
              )}
              {getDuration && <span>| {getDuration || "-"}</span>}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {jobData.description}
        </p>

        {/* SKILLS & TOOLS */}
        {(job.skills?.length || job.tools?.length) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {jobData.skills?.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
              >
                {skill}
              </span>
            ))}
            {jobData.tools?.slice(0, 3).map((tool, i) => (
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
            {jobData.location && (
              <div className="flex items-center gap-1.5">
                <IoLocationSharp className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  {resolvedAddress || jobData.location}
                </span>
              </div>
            )}

            {job.slaLevel && (
              <div className="flex items-center gap-1.5">
                <icons.active className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  {job.slaLevel}
                </span>
              </div>
            )}

            {(jobData.salary || "-") && (
              <div className="flex items-center gap-1.5">
                <BiDollar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  {jobData.salary || "-"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <BiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {getExperienceLevel(
                  jobData.experience ? Number(jobData.experience) : 0,
                )}
              </span>
            </div>
          </div>

          {/* BOOKMARK */}
          {showBookmark && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div
                onClick={handleBookmarkClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <icons.bookmarkFilled className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                ) : (
                  <icons.bookmark className="w-4 h-4" />
                )}
              </div>
              <span>{jobData.postedTime || "Just now"}</span>
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
