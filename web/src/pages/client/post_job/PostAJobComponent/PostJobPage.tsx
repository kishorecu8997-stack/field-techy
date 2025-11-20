import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import usePostAJobStore from "@/shared/store/postAJobStore";
import { useForm } from "react-hook-form";
import PostAJobFields from "./components/PostAJobFields";
import JobPostDropdown from "./JobPostDropdown";

const PostJobPage = () => {
  const formCtx = useForm({
    defaultValues: {
      projectName: "",
      jobName: "",
      jobTitle: "",
      locationType: "",
      location: "",
      experienceLevel: "",
      numberOfVacancy: "",
      skillsRequired: "",
      tools: "",
      safetyWears: "",
      description: "",
      backFills: "",
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
      jobOccurrence: "",
      repeatedBy: "week",
      occurrenceEndType: "",
      after: "",
      repeatedByMonth: "",
      repeatedByYear: "",
      JobOccurrenceEndDate: "",
      estimatedDuration: "",
    },
    mode: "onSubmit",
  });

  const TemplateOptions = [
    { label: "Template 1", value: "template1" },
    { label: "Template 2", value: "template2" },
    { label: "Template 3", value: "template3" },
  ];

  const { currentLocation } = usePostAJobStore();
  return (
    <div>
      <FormContainer methods={formCtx}>
        <MyJobsHeader
          title={
            currentLocation === "dedicated"
              ? "Post a Job - Dedicated Service"
              : currentLocation === "dispatch"
              ? "Post a Job - Dispatch Service"
              : "Post a Job - Scheduled Service"
          }
          isReport={false}
          isShowSort={false}
          action={
            <JobPostDropdown options={TemplateOptions} />
          }
        />
        <PostAJobFields />
      </FormContainer>
    </div>
  );
};

export default PostJobPage;
