import { absoluteUrls } from "@/config/urls";
import { TemplateData } from "@/dummy_data/client";
import { Button } from "@/shared/components/commonUI/Buttons";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { usePopupStore } from "@/shared/store/popupStore";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backFillsType, locationType, OccurrenceEndType, OccurrenceFields, RepeatByFields, type PostAJobFieldsProps } from "../types";
import PostAJobFields from "./components/PostAJobFields";
import JobPostDropdown from "./JobPostDropdown";
import type { PostOption } from "./TalentSection";

const PostJobPage = () => {
  const [isDisable, setIsDisable] = useState(false);
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const formCtx = useForm<PostAJobFieldsProps>({
    defaultValues: {
      projectName: "",
      jobName: "",
      jobTitle: "",
      locationType: locationType.remote,
      location: "",
      experienceLevel: "",
      numberOfVacancy: "",
      skills: [],
      tools: [],
      safetyWears: [],
      task: [],
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
    },
    mode: "onSubmit",
  });

  const getTemplateData = () => {
    return TemplateData.map((item) => ({
      label: item.templatesName,
      value: item.id,
      action: async () => templateActionHandler(item.id),
    }));
  };

  const handleTemplateDate = async (id: number) => {
    const findTemplate = TemplateData.find((item) => item.id === id);
    formCtx.reset(findTemplate as PostAJobFieldsProps);
  };

  const templateActionHandler = async (id: number) => {
    await showPopup({
      title: "Apply Template",
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
            await handleTemplateDate(id);
            toast.success("Template applied successfully");
          },
        },
      ],
    });
  };

  const handleSubmit = async (data: any) => {
    console.log(data);
    await showPopup({
      title: "Post a Job",
      body: "Are you sure you want to post a job?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Post",
          value: "post",
          variant: "primary",
          action: async (close) => {
            await handlePostAJob(data);
            close(true);
            navigate(absoluteUrls.client.home.my_jobs);
          },
        },
      ],
    });
  };

  const handlePostAJob = async (data: any) => {
    toast.success("Job Posted successfully");
  };

  const { currentLocation } = usePostAJobStore();
  return (
    <div>
      <FormContainer methods={formCtx} onSubmit={handleSubmit}>
          <MyJobsHeader
            title={
              currentLocation === CurrentLocation.dedicated
                ? "Post a Job - Dedicated Service"
                : currentLocation === CurrentLocation.dispatch
                ? "Post a Job - Dispatch Service"
                : "Post a Job - Scheduled Service"
            }
            isReport={false}
            isShowSort={false}
            action={
              isDisable ? (
                <div className="flex gap-2">
                  <Button
                    className="rounded-full"
                    variant="outline"
                    onClick={() => setIsDisable(false)}
                  >
                    Back to Edit
                  </Button>
                  <Button className="rounded-full" type="submit">
                    Post a Job
                  </Button>
                </div>
              ) : (
                currentLocation === CurrentLocation.dispatch && (
                  <JobPostDropdown
                    label="Template"
                    options={getTemplateData() as PostOption[]}
                  />
                )
              )
            }
          />
        <PostAJobFields setIsDisable={setIsDisable} isDisable={isDisable} />
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
