import type { ClientPostJobData } from "@/api";
import { absoluteUrls } from "@/config/urls";
import { JOB_TYPES } from "@/constants/jobTypes";
import { TemplateData } from "@/dummy_data/client";
import {
  useClientGetJobs,
  useClientGetRateCard,
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
import { useEffect, useRef } from "react";
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
  const { currentLocation, rate, currencyId, setRateAndCurrency } =
    usePostAJobStore();
  const { refetch: refetchJobs } = useClientGetJobs();
  const billConsentRef = useRef(false);
  const isDisable = false;

  const formCtx = useForm<PostAJobFieldsProps>({
    defaultValues: {
      projectName: "",
      jobName: "",
      jobTitle: "",
      serviceCategory: "",
      locationType: JOB_TYPES.onsite,
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
  const selectedCountry = formCtx.watch("country");
  const serviceCategory = formCtx.watch("serviceCategory");
  const experienceLevel = formCtx.watch("experienceLevel");
  const engagementModel = formCtx.watch("engagementModel");
  const { mutate: getRateCard } = useClientGetRateCard();

  useEffect(() => {
    if (
      !serviceCategory ||
      !experienceLevel ||
      !engagementModel ||
      !selectedCountry
    ) {
      console.log("here");
      setRateAndCurrency("", 0);
      return;
    }

    getRateCard(
      {
        query: {
          serviceCategoryId: Number(serviceCategory),
          experienceLevelId: Number(experienceLevel),
          engagementModelId: Number(engagementModel),
          countryId: Number(selectedCountry),
        },
      },
      {
        onSuccess: (response) => {
          console.log(response, "response");
          setRateAndCurrency(
            `${response.rate}${response.currencySymbol}`,
            response.currencyId,
          );
        },
        onError: () => setRateAndCurrency("0", 0),
      },
    );
  }, [
    serviceCategory,
    experienceLevel,
    engagementModel,
    selectedCountry,
    getRateCard,
    setRateAndCurrency,
  ]);

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

  const getRequiredNumber = (val: unknown, fieldName: string): number => {
    const num = Number(val);
    if (!num) throw new Error(`${fieldName} is required`);
    return num;
  };
  const uploadFile = (file: File, url: string) =>
    fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
  const uploadAttachmentsAndTools = async (
    response: any,
    data: PostAJobFieldsProps,
  ) => {
    const uploadPromises: Promise<unknown>[] = [];
    data.attachment?.[0] &&
      response.uploadUrls.attachment &&
      uploadPromises.push(
        uploadFile(data.attachment[0], response.uploadUrls.attachment),
      );
    (data.toolsData ?? [])
      .filter((t) => t.images?.[0]?.file)
      .forEach((tool, index) => {
        const url = response.uploadUrls.tools?.[index];
        if (url && tool.images?.[0]?.file)
          uploadPromises.push(uploadFile(tool.images[0].file, url));
      });
    await Promise.all(uploadPromises);
    if (uploadPromises.length > 0) {
      await markUploaded({ body: { jobId: response.id } });
    }
  };
  const createJobPayload = (
    data: PostAJobFieldsProps,
  ): ClientPostJobData["body"] => ({
    jobTitle: data.jobTitle,
    jobDescription: data.description,
    jobType: data.locationType,
    countryId: getRequiredNumber(data.country, "Country"),
    stateId: getRequiredNumber(data.state, "State"),
    cityId: getRequiredNumber(data.city, "City"),
    startDate: data.startDate ? data.startDate.toISOString() : undefined,
    endDate: data.endDate ? data.endDate.toISOString() : undefined,
    vacancies: Number(data.numberOfVacancy) || 1,
    serviceCategoryId: getRequiredNumber(
      data.serviceCategory,
      "Service Category",
    ),
    experienceLevelId: getRequiredNumber(
      data.experienceLevel,
      "Experience Level",
    ),
    engagementModelId: getRequiredNumber(
      data.engagementModel,
      "Engagement Model",
    ),
    additionalDetails: data.otherInfo,
    currencyId: currencyId,
    skills: (data.skills || []).map((s) => Number(s)).filter((n) => !isNaN(n)),
    tools: (data.toolsData || []).map((t) => ({
      toolId: Number(t.id) || 0,
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
  });
  const handlePostAJob = async (data: PostAJobFieldsProps) => {
    let payload: ClientPostJobData["body"];

    try {
      payload = createJobPayload(data);
    } catch (error: any) {
      console.error("Payload creation error:", error);
      return toast.error(error.message);
    }

    postJob(
      { body: payload },
      {
        onSuccess: async (response) => {
          try {
            await uploadAttachmentsAndTools(response, data);
            toast.success("Your job has been successfully posted!");
            refetchJobs();
            navigate(absoluteUrls.client.home.my_jobs);
          } catch (error) {
            console.error("File upload error:", error);
            const hasFilesToUpload =
              (data.attachment?.length ?? 0) > 0 ||
              (data.toolsData?.some((t) => t.images?.length > 0) ?? false);
            if (hasFilesToUpload) {
              toast.info(
                "Job created, but some file uploads failed. Please verify the job and re-attach files if needed.",
              );
            } else {
              toast.success("Your job has been successfully posted!");
            }

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
          <PostAJobFields rate={rate} isDisable={isDisable || isPosting} />
        )}
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
