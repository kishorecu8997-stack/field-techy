import { absoluteUrls } from "@/config/urls";
import { TemplateData, experienceLevel } from "@/dummy_data/client";
import { countries } from "@/dummy_data/countries";
import { serviceCategories } from "@/dummy_data/serviceCategories";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  backFillsType,
  OccurrenceEndType,
  OccurrenceFields,
  RepeatByFields,
  type locationTypeType,
  type PostAJobFieldsProps,
  type PostOption,
} from "../types";
import { ENGAGEMENT_MODELS } from "@/dummy_data/jobFormOptions";
import PostAJobFields from "./components/PostAJobFields";
import JobPostDropdown from "./JobPostDropdown";

/**
 * PostJobPage Component
 * The main page for posting a job.
 * It includes a form for entering job details, a dropdown for selecting job posting options, and a button to submit the form.
 * @returns {JSX.Element} The rendered PostJobPage component.
 */
const PostJobPage = () => {
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();
  const { currentLocation } = usePostAJobStore();
  const billConsentRef = useRef(false);
  const isDisable = false;

  const formCtx = useForm<PostAJobFieldsProps>({
    defaultValues: {
      projectName: "",
      jobName: "",
      jobTitle: "",
      serviceCategory: "",
      locationType: "" as unknown as locationTypeType,
      location: "",
      engagementModel: "",
      country: "",
      state: "",
      city: "",
      experienceLevel: "",
      numberOfVacancy: "",
      toolBudgetTotal: 0,
      skills: [],
      tools: [],
      safetyWears: [],
      task: "",
      description: "",
      backFills: backFillsType.required,
      budget: "",
      primaryLanguage: "",
      secondaryLanguage: "",
      attachment: null,
      otherInfo: "",
      startDate: null,
      startTime: "",
      endDate: null,
      endTime: "",
      jobDuration: "",
      tentativeStartDate: null,
      tentativeEndDate: null,
      tentativeEndTime: "",
      jobOccurrence: OccurrenceFields.repeat,
      repeatedBy: RepeatByFields.week,
      occurrenceEndType: OccurrenceEndType.onDate,
      after: "",
      repeatedByMonth: "",
      templatesName: "",
      repeatedByYear: "",
      JobOccurrenceEndDate: null,
      estimatedDuration: "",
      saveAsTemplate: false,
    },
    mode: "onSubmit",
  });

  const getTemplateData = () => {
    return TemplateData.map((item) => ({
      label: item.templatesName,
      value: item.id,
      action: async () =>
        await templateActionHandler({
          label: item.templatesName,
          value: item.id,
        }),
    }));
  };

  const handleTemplateDate = async (id: number) => {
    const findTemplate = TemplateData.find((item) => item.id === id);
    formCtx.reset(findTemplate as PostAJobFieldsProps);
  };

  const templateActionHandler = async (data: PostOption) => {
    await showPopup({
      title: `Apply ${data.label} Template`,
      body: "Are you sure you want to apply this template? We’ll load the selected template and update your form with its details.",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Apply",
          value: "apply",
          variant: "primary",
          action: async (close) => {
            close(true);
            await handleTemplateDate(data.value as number);
            toast.success("Template applied successfully");
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: PostAJobFieldsProps) => {
    billConsentRef.current = false;
    const ratePerWeek = 2000;

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
      if (Number.isNaN(s) || Number.isNaN(e) || e < s) return { days: 1, weeks: 1 };
      const diffDays = Math.ceil((e - s + 86400000) / 86400000);
      const weeks = Math.max(1, Math.ceil(diffDays / 7));
      return { days: diffDays, weeks };
    };

    const duration = getDuration(data.startDate, data.endDate);
    const weeks = duration.weeks;
    const toolBudget = data.toolBudgetTotal || 0;
    const totalBill = (ratePerWeek * weeks * Number(data.numberOfVacancy || 1)) + toolBudget;
    const currency = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(totalBill);

    const body = (
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
              {getLabel(ENGAGEMENT_MODELS, data.engagementModel)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Rate</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
              ₹{ratePerWeek}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Duration</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs text-right">
              {formatDate(data.startDate)} – {formatDate(data.endDate)} ({duration.days < 7 ? `${duration.days} ${duration.days === 1 ? "day" : "days"}` : `${weeks} ${weeks === 1 ? "week" : "weeks"}`})
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Number of Vacancies</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
              {data.numberOfVacancy || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Tools budget</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">
              {data.toolBudgetTotal ? `₹${data.toolBudgetTotal.toLocaleString("en-IN")}` : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Service Charge</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs">Free</span>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-600" />

        <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-gray-100 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded px-3 py-2">
          <span>Total Bill</span>
          <span>{currency}</span>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 dark:bg-gray-700 dark:border-gray-600"
            defaultChecked={billConsentRef.current}
            onChange={(e) => {
              billConsentRef.current = e.target.checked;
            }}
          />
          <span>By continuing, you agree to share this data within the selected region</span>
        </label>
      </div>
    );

    await showPopup({
      title: <span className="text-teal-700 dark:text-teal-400">Bill Summary per an Engineer</span>,
      body,
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Edit Details",
          value: "edit",
          variant: "outline",
        },
        {
          label: "Post Job",
          value: "post",
          variant: "primary",
          action: async (close) => {
            if (!billConsentRef.current) {
              toast.error("Please agree to the data sharing checkbox before posting");
              return;
            }
            await handlePostAJob(data);
            close(true);
            navigate(absoluteUrls.client.home.my_jobs);
          },
        },
      ],
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePostAJob = async (_data: PostAJobFieldsProps) => {
    toast.success("Job Posted successfully");
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800">
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <MyJobsHeader
          title={
            currentLocation === CurrentLocation.dedicated
              ? "Post a Job - Dedicated Service"
              : currentLocation === CurrentLocation.dispatch
                ? "Post a Job - Dispatch Service"
                : currentLocation === CurrentLocation.scheduled
                  ? "Post a Job - Scheduled Service"
                  : currentLocation === CurrentLocation.fullTime
                    ? "Post a Job - Full Time"
                    : currentLocation === CurrentLocation.onDemand
                      ? "Post a Job - On Demand"
                      : "Post a Job"
          }
          isReport={false}
          isShowSort={false}
          action={
            currentLocation === CurrentLocation.dispatch && (
              <JobPostDropdown
                label="Template"
                options={getTemplateData() as PostOption[]}
              />
            )
          }
        />

        {currentLocation && (
          <PostAJobFields isDisable={isDisable} />
        )}
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
