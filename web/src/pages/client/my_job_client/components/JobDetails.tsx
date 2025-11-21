import React, { useState } from "react";
import SidebarJobPostWallet from "@/shared/components/SidebarJobPostWallet";
import { earningsData } from "@/dummy_data/jobDetails";
import JobCardDetailsHeader from "./JobCardDetailsHeader";
import FilterButton from "@/shared/components/commonUI/FilterButton";
import ClientHeader from "./ClientHeader";
import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { SORT_OPTIONS, type JobStatus } from "../../search_result/types";
import JobTabSection from "./JobTabSection";
import { useParams } from "react-router-dom";
import { sampleJobs } from "@/dummy_data/searchData";

/**
 * `JobsDetails` is a page component that displays detailed information about a specific job.
 * It features a header with job status and actions, a filterable section for different job aspects
 * (like logs, submissions, etc.), and a sidebar with wallet information.
 * @returns {React.ReactElement} The rendered job details page.
 */
const JobsDetails: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Jobs");

  const jobFilters = [
    "Engineers Logs",
    "Work Submissions",
    "Job Information",
    "Requirement",
    "SPOC",
    "Other",
    "Proposal's Terms & Conditions",
  ];
   const params = useParams();
  const [isWorkSubmitted, setIsWorkSubmitted] = useState(false);
  const [isSendProposal, setIsSendProposal] = useState(false);
  const [isJobAccepted, setIsJobAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Information");

  const filter = () => {
    return sampleJobs.find((job) => {
      return job.id === Number(params.jobId);
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">           
            <MyJobsHeader
              title="Job Details"
              currentSort={SORT_OPTIONS.NEWEST}
              isReport
              onSortChange={() => {}}
            />
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
              <JobCardDetailsHeader
                title="Mobile App UI/UX Designer and Product Designer"
                hours={8}
                client="TechNova Co"
                status="On Site"
                onApprove={() => console.log("Work approved")}
                onRequestRevision={() => console.log("Revision requested")}
              />
             <div className="space-y-6 pt-2">             
                 <JobTabSection
              status={filter()?.status as JobStatus}
              isWorkSubmitted={isWorkSubmitted}
              isSendProposal={isSendProposal}
              isJobAccepted={isJobAccepted || true}
              activeTab={activeTab}
            />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SidebarJobPostWallet earnings={earningsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsDetails;
