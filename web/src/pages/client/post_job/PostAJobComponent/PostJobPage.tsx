import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import usePostAJobStore, {
  CurrentLocation,
} from "@/shared/store/postAJobStore";
import { useForm } from "react-hook-form";
import PostAJobFields from "./components/PostAJobFields";
import JobPostDropdown from "./JobPostDropdown";
import { useState } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import { useNavigate } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";

const PostJobPage = () => {
  const [isDisable, setIsDisable] = useState(false);
  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const formCtx = useForm({
    defaultValues: {
      projectName: "",
      jobName: "",
      jobTitle: "",
      locationType: "remote",
      location: "",
      experienceLevel: "",
      numberOfVacancy: "",
      skillsRequired: "",
      tools: "",
      safetyWears: "",
      description: "",
      backFills: "required",
      budget: "",
      primaryLanguage: "",
      secondaryLanguage: "",
      attachment: "",
      otherInfo: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      jobDuration: "",
      tentativeStartDate: "",
      tentativeEndDate: "",
      tentativeEndTime: "",
      jobOccurrence: "repeat",
      repeatedBy: "week",
      occurrenceEndType: "onDate",
      after: "",
      repeatedByMonth: "",
      repeatedByYear: "",
      JobOccurrenceEndDate: "",
      estimatedDuration: "",
    },
    mode: "onSubmit",
  });

  const handleTemplateDate = async () => {
    formCtx.reset({
      projectName: "Test Project",
      jobName: "Test Job",
      jobTitle: "Test Job Title",
      locationType: "remote",
      location: "remote",
      experienceLevel: "experience1",
      numberOfVacancy: "1",
      skillsRequired: "skill1",
      tools: "tool1",
      safetyWears: "safetyWear1",
      description: "Test Description",
      backFills: "required",
      budget: "1000",
      primaryLanguage: "language1",
      secondaryLanguage: "language1",
      attachment: "",
      otherInfo: "Test Other Info",
      startDate: "", // TODO: Set default date
      startTime: "",
      endDate: "",
      endTime: "",
      jobDuration: "20",
      tentativeStartDate: "",
      tentativeEndDate: "",
      tentativeEndTime: "",
      jobOccurrence: "repeat",
      repeatedBy: "week",
      occurrenceEndType: "onDate",
      after: "",
      repeatedByMonth: "feb",
      repeatedByYear: "2025",
      JobOccurrenceEndDate: "",
      estimatedDuration: "20",
    });
  };

  const TemplateOptions = [
    {
      label: "Template 1",
      value: "template1",
      action: async () =>
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
                await handleTemplateDate();
                toast.success("Template applied successfully");
              },
            },
          ],
        }),
    },
  ];

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
            close(true);
            await handlePostAJob(data);
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
        <div className="sticky top-18 z-20">
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
                  <JobPostDropdown label="Template" options={TemplateOptions} />
                )
              )
            }
          />
        </div>
        <PostAJobFields setIsDisable={setIsDisable} isDisable={isDisable} />
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
