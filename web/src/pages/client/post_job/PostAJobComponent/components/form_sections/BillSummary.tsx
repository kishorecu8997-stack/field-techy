import { useLookupData } from "@/shared/apiServices/client/clientOpenApiService";
import usePostAJobStore from "@/shared/store/postAJobStore";
import { useMemo } from "react";
import { type PostAJobFieldsProps } from "../../../types";

interface BillSummaryProps {
  data: PostAJobFieldsProps;
  onConsentChange: (checked: boolean) => void;
  defaultConsent?: boolean;
}

/**
 * Bill Summary Component
 * This component renders a summary of the job posting data and allows the user to consent to the data sharing.
 * @param {BillSummaryProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered BillSummary component.
 */
export const BillSummary = ({
  data,
  onConsentChange,
  defaultConsent = false,
}: BillSummaryProps) => {
  // Lookup Data
  const { data: countriesData } = useLookupData("countries");
  const { data: serviceCategoriesData } = useLookupData("serviceCategories");
  const { data: experienceLevelsData } = useLookupData("experienceLevels");
  const { data: engagementModelsData } = useLookupData("engagementModels");
  const { rate, currencySymbol, amount } = usePostAJobStore();

  const countries = useMemo(
    () =>
      countriesData?.map((c) => ({ label: c.name, value: String(c.id) })) || [],
    [countriesData],
  );
  const serviceCategories = useMemo(
    () =>
      serviceCategoriesData?.map((s) => ({
        label: s.name,
        value: String(s.id),
      })) || [],
    [serviceCategoriesData],
  );
  const experienceLevel = useMemo(
    () =>
      experienceLevelsData?.map((e) => ({
        label: e.name,
        value: String(e.id),
      })) || [],
    [experienceLevelsData],
  );
  const engagementModels = useMemo(
    () =>
      engagementModelsData?.map((e) => ({
        label: e.name,
        value: String(e.id),
      })) || [],
    [engagementModelsData],
  );

  const getLabel = (opts: { value: string; label: string }[], v?: string) =>
    opts.find((o) => o.value === v)?.label || "-";

  const formatDate = (value?: Date | null): string => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = (start?: Date | null, end?: Date | null) => {
    if (!start || !end) return { days: 1, weeks: 1 };
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (Number.isNaN(s) || Number.isNaN(e) || e < s)
      return { days: 0, weeks: 0 };
    const diffDays = Math.ceil((e - s) / 86400000);
    const days = Math.max(1, diffDays);
    const weeks = Math.ceil(days / 7);
    return { days, weeks };
  };

  const duration = getDuration(data.startDate, data.endDate);
  const weeks = duration.weeks;
  const toolBudget = data.toolBudgetTotal || 0;
  const totalBill =
    Number(amount) * weeks * Number(data.numberOfVacancy || 1) + toolBudget;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Service Category</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {getLabel(serviceCategories, data.serviceCategory)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Country</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {getLabel(countries, data.country)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Engineer Experience Level</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {getLabel(experienceLevel, data.experienceLevel)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Engagement Model</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {getLabel(engagementModels, data.engagementModel)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Rate</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {rate}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Duration</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs text-right">
            {formatDate(data.startDate)} – {formatDate(data.endDate)} (
            {duration.days < 7
              ? `${duration.days} ${duration.days === 1 ? "day" : "days"}`
              : `${weeks} ${weeks === 1 ? "week" : "weeks"}`}
            )
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Number of Vacancies</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {data.numberOfVacancy}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Tools Cost</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            {data.toolBudgetTotal
              ? `${currencySymbol}${data.toolBudgetTotal.toLocaleString("en-IN")}`
              : "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Service Charge</span>
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
            Free
          </span>
        </div>
      </div>
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-100 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded px-3 py-2">
        <span>Total Bill</span>
        <span>
          {currencySymbol}{totalBill.toLocaleString("en-IN")}
        </span>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 dark:bg-gray-700 dark:border-gray-600"
          defaultChecked={defaultConsent}
          onChange={(e) => {
            onConsentChange(e.target.checked);
          }}
        />
        <span>
          By continuing, you agree to share this data within the selected region
        </span>
      </label>
    </div>
  );
};

export default BillSummary;
