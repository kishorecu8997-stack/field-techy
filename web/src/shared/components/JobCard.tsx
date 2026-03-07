import { absoluteUrls } from "@/config/urls";
import { WORKING_TYPES_PROPERTY } from "@/pages/engineer/search_result/types";
import { useClientGetCompanyInfo } from "@/shared/apiServices/client/clientOpenApiService";
import { JobStatusBadge } from "@/shared/components/JobStatusBadge/JobStatusBadge";
import { getDurationString, scrollToTop } from "@/utils";
import { formatAmount } from "@/utils/currency";
import { MdLocationPin } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LocationDisplay from "./commonUI/LocationDisplay";

/**
 * Formats a date string to a readable format (DD/MM/YYYY)
 */
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "N/A";
  }
};

interface JobCardProps {
  id: number;
  jobTitle: string;
  status?: string | null;
  jobType: string;
  startDate?: string | null;
  endDate?: string | null;
  workLocationName?: string | null;
  totalPrice?: string | null;
  currencySymbol?: string;
  clientId: number;
  clientDetails?: {
    companyName?: string | null;
    personName?: string | null;
    name?: string | null; // fallbacks
  } | null;
  allocationType?: "Automatic" | "Manual";
  [key: string]: unknown;
}

/**
 * Reusable job card component displaying key job details with status and type badges.
 * Links to the job details page on click.
 */
const JobCard: React.FC<JobCardProps> = (props) => {
  const {
    allocationType = "Automatic",
    id,
    jobTitle,
    status,
    jobType,
    startDate,
    endDate,
    workLocationName,
    totalPrice,
    clientDetails,
    currencySymbol,
    countryId,
    stateId,
    cityId,
  } = props;
  const location = useLocation();
  const isClientPath = location.pathname.includes("/client");
  const formattedPay = formatAmount(totalPrice, currencySymbol);


  // Only call this API if we are in the client module to avoid permission errors
  const { data: client } = useClientGetCompanyInfo(
    isClientPath && !!props.clientId,
  );

  const getDuration = (): string => {
    if (!startDate) return "N/A";
    if (!endDate) return "N/A";
    return getDurationString({
      startDateStr: startDate,
      endDateStr: endDate,
    });
  };

  const companyName =
    clientDetails?.companyName ||
    clientDetails?.personName ||
    clientDetails?.name ||
    (client as any)?.companyName ||
    (client as any)?.name ||
    (client as any)?.personName ||
    "N/A";

  return (
    <Link
      to={`${absoluteUrls.engineer.home.my_jobs}/${id}`}
      onClick={() => scrollToTop()}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {jobTitle}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-medium bg-teal-800 text-white dark:bg-teal-700 whitespace-nowrap`}
        >
          {(() => {
            // Normalize jobType for comparison (handle case differences between API and constants)
            const normalizedJobType = jobType?.toLowerCase();
            switch (normalizedJobType) {
              case WORKING_TYPES_PROPERTY.onsite.toLowerCase():
                return WORKING_TYPES_PROPERTY.onsite;
              case WORKING_TYPES_PROPERTY.remote.toLowerCase():
                return WORKING_TYPES_PROPERTY.remote;
              case WORKING_TYPES_PROPERTY.hybrid.toLowerCase():
                return WORKING_TYPES_PROPERTY.hybrid;
              default:
                return jobType || "Unknown";
            }
          })()}
        </span>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3 min-w-0">
        <p className="truncate">
          <span className="font-medium">Client:</span> {companyName}
        </p>
        <p className="truncate">
          <span className="font-medium">Start: </span>
          {formatDate(startDate)}
        </p>
        <p className="truncate">
          <span className="font-medium">Duration:</span> {getDuration()}
        </p>
      </div>
      <div className="flex justify-between items-start pt-2 border-t border-gray-200 dark:border-gray-700 gap-4">
        <div className="flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1">
          <MdLocationPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="break-words">
            <LocationDisplay
              countryId={countryId as number | undefined}
              stateId={stateId as number | undefined}
              cityId={cityId as number | undefined}
              workLocationName={workLocationName}
            />
          </div>
        </div>

        <div className="flex-shrink-0 text-sm font-semibold text-teal-800 dark:text-teal-400 whitespace-nowrap pt-0.5">
          {formattedPay}
        </div>
      </div>

      <div className="mt-3">
        <JobStatusBadge status={status as any} />
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-2">
          <span className="font-medium">Allocation:</span> {allocationType}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
