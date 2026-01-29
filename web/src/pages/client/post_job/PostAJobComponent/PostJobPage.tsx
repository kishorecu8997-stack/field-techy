import type { ClientPostJobData } from "@/api";
import { absoluteUrls } from "@/config/urls";
import { TemplateData } from "@/dummy_data/client";
import {
  useClientMarkJobFileUploaded,
  useClientPostJob,
} from "@/shared/apiServices/client/clientOpenApiService";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  backFillsType,
  OccurrenceEndType,
  OccurrenceFields,
  RepeatByFields,
  type PostAJobFieldsProps,
  type PostOption,
} from "../types";
import BillSummary from "./components/form_sections/BillSummary";
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
      locationType: "",
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
      description: ".",
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
    const body = (
      <BillSummary
        data={data}
        defaultConsent={billConsentRef.current}
        onConsentChange={(checked) => {
          billConsentRef.current = checked;
        }}
      />
    );

    await showPopup({
      title: (
        <span className="text-teal-700 dark:text-teal-400">Bill Summary</span>
      ),
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
          action: (close) => {
            close(false);
          },
        },
        {
          label: "Post Job",
          value: "post",
          variant: "primary",
          action: async (close) => {
            if (!billConsentRef.current) {
              toast.error("Agree to data sharing before posting the job");
              return;
            }
            await handlePostAJob(data);
            close(true);
          },
        },
      ],
    });
  };

  const { mutate: postJob, isPending: isPosting } = useClientPostJob();
  const { mutateAsync: markUploaded } = useClientMarkJobFileUploaded();

  const handlePostAJob = async (data: PostAJobFieldsProps) => {
    // Map form data to API payload
    const payload: ClientPostJobData["body"] = {
      jobTitle: data.jobTitle,
      jobDescription: data.description,
      jobType:
        data.locationType === "onsite"
          ? "On site"
          : data.locationType === "remote"
            ? "Remote"
            : "Hybrid",
      countryId: Number(data.country) || 1,
      stateId: Number(data.state) || 1,
      cityId: Number(data.city) || 1,
      startDate: data.startDate ? data.startDate.toISOString() : undefined,
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
      vacancies: Number(data.numberOfVacancy) || 1,
      serviceCategoryId: Number(data.serviceCategory) || 1,
      experienceLevelId: Number(data.experienceLevel) || 1,
      engagementModelId: Number(data.engagementModel) || 1,
      additionalDetails: data.otherInfo,
      currencyId: 1,
      skills: (data.skills || [])
        .map((s) => Number(s))
        .filter((n) => !isNaN(n)),
      tools: (data.toolsData || []).map((t) => ({
        toolId: Number(t.id) || 0, // Using the selected tool ID
        budget: Number(t.budget.replace(/[^0-9.]/g, "")) || 0,
        image:
          t.images && t.images.length > 0 && t.images[0].file
            ? {
                filename: t.images[0].file.name,
                size: t.images[0].file.size,
                mimeType: t.images[0].file.type,
              }
            : undefined,
      })),
      attachment:
        data.attachment && data.attachment.length > 0
          ? {
              filename: data.attachment[0].name,
              size: data.attachment[0].size,
              mimeType: data.attachment[0].type,
            }
          : undefined,
    };

    postJob(
      { body: payload },
      {
        onSuccess: async (response) => {
          try {
            const uploadPromises: Promise<unknown>[] = [];

            // Upload Attachment
            if (
              response.uploadUrls.attachment &&
              data.attachment &&
              data.attachment.length > 0
            ) {
              uploadPromises.push(
                fetch(response.uploadUrls.attachment, {
                  method: "PUT",
                  body: data.attachment[0],
                  headers: {
                    "Content-Type": data.attachment[0].type,
                  },
                }),
              );
            }

            // Upload Tool Images
            if (
              response.uploadUrls.tools &&
              response.uploadUrls.tools.length > 0
            ) {
              const toolsWithImages = (data.toolsData || []).filter(
                (t) => t.images && t.images.length > 0 && t.images[0].file,
              );

              toolsWithImages.forEach((tool, index) => {
                if (response.uploadUrls.tools[index] && tool.images[0].file) {
                  uploadPromises.push(
                    fetch(response.uploadUrls.tools[index], {
                      method: "PUT",
                      body: tool.images[0].file,
                      headers: {
                        "Content-Type": tool.images[0].file.type,
                      },
                    }),
                  );
                }
              });
            }

            await Promise.all(uploadPromises);

            if (uploadPromises.length > 0) {
              await markUploaded({ body: { jobId: response.id } });
            }

            toast.success(`Job posted! Code: ${response.jobCode}`);
            navigate(absoluteUrls.client.home.my_jobs);
          } catch (error) {
            console.error("Upload error:", error);
            toast.error("Job posted but failed to upload files");
            navigate(absoluteUrls.client.home.my_jobs);
          }
        },
        onError: (error: unknown) => {
          console.error("Post job error:", error);
          toast.error(GlobalApiErrorHandler.handle(error).message);
        },
      },
    );
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800">
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
        <MyJobsHeader
          title={
            currentLocation === CurrentLocation.fullTime
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
          <PostAJobFields isDisable={isDisable || isPosting} />
        )}
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
