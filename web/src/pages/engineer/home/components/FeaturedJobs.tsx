import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import {
  useGetEngineerSavedJobs,
  useStoreEngineerSaveJobs,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import { getExperienceLevel } from "@/utils";
import { calculateMatchScore } from "@/utils/matchCalculator";
import { formatCurrency } from "@/shared/libs/utils";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { JobItem } from "../types";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";

/**
 * Renders a circular progress ring for the match score.
 * Dynamic coloring: Rose (<50%), Amber (50-79%), Green (80%+)
 */
// const MatchScoreRing: React.FC<{ score: number }> = ({ score }) => {
//   const size = 38;
//   const strokeWidth = 3;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (score / 100) * circumference;
//   const getColorClass = (val: number) => {
//     if (val >= 80) return "text-green-600 dark:text-green-400";
//     if (val >= 50) return "text-amber-500 dark:text-amber-400";
//     return "text-rose-500 dark:text-rose-400";
//   };
//   const activeColor = getColorClass(score);
//   return (
//     <div
//       className="relative flex items-center justify-center flex-shrink-0"
//       style={{ width: size, height: size }}
//     >
//       <svg
//         className="w-full h-full transform -rotate-90"
//         viewBox={`0 0 ${size} ${size}`}
//       >
//         <circle
//           className="text-gray-200 dark:text-gray-700"
//           stroke="currentColor"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           r={radius}
//           cx={size / 2}
//           cy={size / 2}
//         />
//         <circle
//           className={`${activeColor} transition-all duration-1000 ease-in-out`}
//           stroke="currentColor"
//           strokeWidth={strokeWidth}
//           fill="transparent"
//           r={radius}
//           cx={size / 2}
//           cy={size / 2}
//           style={{
//             strokeDasharray: circumference,
//             strokeDashoffset: strokeDashoffset,
//             strokeLinecap: "round",
//           }}
//         />
//       </svg>

//       <span className={`absolute text-[10px] font-bold ${activeColor}`}>
//         {score}%
//       </span>
//     </div>
//   );
// };

/**
 * JobCard Component - Displays a single job listing card
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Job title
 * @param {string} props.company - Company name
 * @param {string} props.companyLogo - Company logo URL or path
 * @param {string} props.category - Job category (e.g., "IT")
 * @param {string} props.employmentType - Employment type (e.g., "Full-Time")
 * @param {string} props.locationType - Location type (e.g., "On Site")
 * @param {string} props.salary - Salary information
 * @param {string} props.location - Job location
 * @param {boolean} [props.isBookmarked=false] - Whether the job is bookmarked
 * @param {Function} [props.onBookmarkToggle] - Callback function when bookmark is toggled
 * @param {string[]} props.skills - Array of required skills (e.g., "Figma", "UI/UX")
 * @param {string[]} props.tools - Array of required tools or platforms.
 * @param {string} props.slaLevel - Service Level Agreement response time (e.g., "4-hour response").
 * @param {number} props.matchScore - Profile match percentage (0-100).
 *
 * @example
 * <JobCard
 *   title="Software Engineer"
 *   company="Google"
 *   companyLogo="/logos/google.png"
 *   category="IT"
 *   employmentType="Full-Time"
 *   locationType="On Site"
 *   salary={`${getCurrencyFromStorage()}180,000/year`}
 *   location="California, USA"
 * experience: 5,
 * skills: ["Figma", "Adobe XD", "UI/UX"],
 * tools: ["VS Code", "Git", "Jira"],
 * slaLevel: "4-hour response",
 * matchScore: 85,
 * />
 */
const FeatureJobCard: React.FC<
  JobItem & { matchScore?: number; bookMarkRefetch?: () => void }
> = (props) => {
  const job = props as JobItem;
  const { bookMarkRefetch } = props;
  const { data: engagementModels } = useLookupData("engagementModels");
  // Fetch service categories from API
  const { data: serviceCategoriesData } = useLookupData("serviceCategories");
  const regionId = useUserSessionStore.getState().session?.regionId;

  const { refetch } = useGetEngineerSavedJobs({
    limit: 10,
    page: 1,
  });
  const { isPending, mutate: toggleSaveMutation } = useStoreEngineerSaveJobs({
    onSuccess: (response) => {
      refetch();
      bookMarkRefetch?.();
      toast.success(
        response?.status === "saved"
          ? "Job saved successfully"
          : "Job removed from saved",
      );
    },
    onError: () => {
      toast.error("Failed to update job status. Please try again.");
    },
  });

  const engagementModelName = useMemo(() => {
    if (!props.engagementModel || !engagementModels) return "";
    const model = engagementModels.find(
      (e) => e.id === Number(props.engagementModel),
    );
    return model?.name || "";
  }, [props.engagementModel, engagementModels]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!job.id || isPending) return;

    toggleSaveMutation({
      body: {
        jobId: Number(job.id),
        regionId,
      },
    });
  };

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { address: resolvedAddress } = useReverseGeocoding(props.location);

  const { data: countries } = useLookupData("countries");
  const { data: states } = useLookupData("states", props.countryId?.toString());
  const { data: cities } = useLookupData("cities", props.stateId?.toString());

  const locationDisplay = useMemo(() => {
    const countryName = countries?.find((c) => c.id === props.countryId)?.name;
    const stateName = states?.find((s) => s.id === props.stateId)?.name;

    const parts = [stateName, countryName].filter(Boolean);
    return parts.length > 0
      ? parts.join(", ")
      : resolvedAddress || props.location || "-";
  }, [
    countries,
    states,
    cities,
    props.countryId,
    props.stateId,
    props.cityId,
    resolvedAddress,
    props.location,
  ]);

  // Safely extract the first number from experience (handles "1, 2", "3+", etc.)
  const experienceValue = useMemo(() => {
    if (!props.experience) return 0;
    const match = String(props.experience).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }, [props.experience]);

  // Format salary with currency symbol and comma separation
  const formattedSalary = useMemo(() => {
    if (!props.salary) return "-";
    const numericValue = parseFloat(String(props.salary).replace(/[^0-9.-]/g, ""));
    if (isNaN(numericValue)) return props.salary;
    const symbol = props.currencySymbol || "$";
    return `${symbol} ${formatCurrency(numericValue).replace(/^\$/, "")}`;
  }, [props.salary, props.currencySymbol]);

  return (
    <div className="flex flex-col h-full">
      <>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {props.jobTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {props.client?.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Match score ring hidden - keeping space for bookmark only */}
            <div
              onClick={handleBookmarkClick}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
              aria-label={job.isSaved ? "Remove bookmark" : "Bookmark job"}
            >
              {job.isSaved ? (
                <icons.bookmarkFilled className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              ) : (
                <icons.bookmark className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-2 mb-3 w-full py-2">
          {props.jobType && (
            <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
              {props.jobType}
            </span>
          )}
          {engagementModelName && (
            <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
              {engagementModelName}
            </span>
          )}
          {props.experience && (
            <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
              {getExperienceLevel(experienceValue)}
            </span>
          )}
          {props.slaLevel && (
            <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
              {props.slaLevel}
            </span>
          )}
          {props.category && (
            <span className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-700/60 rounded whitespace-nowrap">
              {serviceCategoriesData?.find((c) => c.id === props.category)
                ?.name || props.category}
            </span>
          )}
        </div>

        {Boolean(props.skills?.length || props.tools?.length) && (
          <div className="flex flex-wrap gap-2">
            {props.skills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700/50 rounded-full whitespace-nowrap"
              >
                {skill}
              </span>
            ))}

            {props.tools?.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700/50 rounded-full whitespace-nowrap"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* ✅ Bottom pinned section */}
        <div className="flex justify-between items-end mt-auto pt-4">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            {formattedSalary}
          </span>
          <div className="text-right">
            {props.slaLevel && (
              <span className="block text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tight mb-0.5">
                {props.slaLevel}
              </span>
            )}
            <span className="block text-gray-500 dark:text-gray-400 text-xs font-medium">
              {locationDisplay}
            </span>
          </div>
        </div>
      </>
    </div>
  );
};

interface FeaturedJobsProps {
  jobs: JobItem[];
  userSkills?: string[];
  userTools?: string[];
  title?: string;
  bookMarkRefetch?: () => void;
  onViewAll?: () => void;
}
const jobCardGradients = [
  "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700",
  "bg-gradient-to-br from-green-50 to-green-100 dark:from-emerald-900/30 dark:to-emerald-800/30",
  "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
  "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
  "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30",
  "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30",
  "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30",
  "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
];
/**
 * FeaturedJobs Component - Displays a list of featured job cards
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.jobs - Array of job objects to display
 * @param {string} [props.title="Featured Jobs"] - Title for the section
 * @param {Function} [props.onViewAll] - Callback function when "View all" is clicked
 *
 *
 * @example
 * <FeaturedJobs
 *   jobs={[
 *     {
 *       title: "Software Engineer",
 *       company: "Google",
 *       companyLogo: "/logos/google.png",
 *       category: "IT",
 *       employmentType: "Full-Time",
 *       locationType: "On Site",
 *       salary: "$180,000/year",
 *       location: "California, USA",
 *       experience: 5,
 *       skills: ["Figma", "Adobe XD", "UI/UX"],
 *       tools: ["VS Code", "Git", "Jira"],
 *       slaLevel: "4-hour response",
 *       matchScore: 85,
 *     }
 *   ]}
 * />
 */
const FeaturedJobs: React.FC<FeaturedJobsProps> = ({
  jobs = [],
  userSkills = [],
  userTools = [],
  bookMarkRefetch,
  title = "Featured Jobs",
  onViewAll,
}) => {
  const navigate = useNavigate();

  const userSkillsAndTools = useMemo(() => {
    return [...userSkills, ...userTools];
  }, [userSkills, userTools]);

  const displayedJobs = useMemo(() => jobs.slice(0, 3), [jobs]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {onViewAll && jobs.length > 3 && (
          <div
            onClick={onViewAll}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm hover:underline dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
          >
            View all
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedJobs.map((job, index) => {
          const jobRequirements = [...(job.skills || []), ...(job.tools || [])];
          const score = calculateMatchScore(
            jobRequirements,
            userSkillsAndTools,
          );
          return (
            <div
              id="featuredJobs"
              key={job.id || index}
              className={`rounded-xl p-4 shadow-sm cursor-pointer transition-transform hover:scale-[1.01] ${
                jobCardGradients[index % jobCardGradients.length]
              }`}
              onClick={() => {
                navigate(`${absoluteUrls.engineer.home.my_jobs}/${job.id}`);
              }}
            >
              <FeatureJobCard
                {...job}
                matchScore={score}
                bookMarkRefetch={bookMarkRefetch}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeaturedJobsMemo = React.memo(FeaturedJobs);
const FeatureJobCardMemo = React.memo(FeatureJobCard);

export {
  FeaturedJobsMemo as FeaturedJobs,
  FeatureJobCardMemo as FeatureJobCard,
};
