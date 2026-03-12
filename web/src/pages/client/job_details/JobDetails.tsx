import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useClientGetJobs } from "@/shared/apiServices/client/clientOpenApiService";
import JobCardHead from "./components/JobCardHead";
import JobTabSection from "../my_job_client/components/JobTabSection";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";

/**
 * Job Details page for client - displays job information with API data
 */
const JobDetails: React.FC = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");
  const parsedRegionId = regionIdParam ? Number(regionIdParam) : undefined;
  const [activeTab] = useState(JOB_TAB_LABELS.timeline);
  const jobId = params.jobId;

  // Fetch jobs data from API
  const {
    data: jobsData,
    isLoading,
    error,
  } = useClientGetJobs({ enabled: true });

  // Check if jobsData is an array
  const jobsArray = Array.isArray(jobsData) ? jobsData : [];

  // Find the specific job from the API data
  const job = jobsArray.find(
    (j: { id?: string | number; regionId?: number | string }) => {
      const jobIdMatch = String(j.id) === jobId;
      const regionIdMatch = parsedRegionId ? Number(j.regionId) === parsedRegionId : true;
      return jobIdMatch && regionIdMatch;
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">
              Loading job details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 dark:text-red-400">
              Error loading job details
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No job found
  if (!job) {
    return (
      <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">
              {jobsArray.length > 0
                ? `Job with ID ${jobId}${parsedRegionId ? ` and regionId ${parsedRegionId}` : ""} not found. Available jobs: ${jobsArray.map((j: { id: number; regionId?: number }) => `${j.id}(region:${j.regionId})`).join(", ")}`
                : "No jobs found for this client"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format status for display
  const statusDisplay = job.status || "Posted";

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Job Card Header */}
        <div className="mb-6">
          <JobCardHead
            title={job.jobTitle || "Untitled Job"}
            hours={0}
            client="N/A (This is your job)"
            status={statusDisplay}
            onApprove={() => console.log("Approve clicked")}
            onRequestRevision={() => console.log("Request Revision clicked")}
          />
        </div>

        {/* Tabs Section */}
        <JobTabSection
          status={statusDisplay}
          activeTab={activeTab}
          job={job}
          assignmentId={
            job.assignmentIds?.[0]
              ? Number(job.assignmentIds[0])
              : Number(jobId)
          }
        />
      </div>
    </div>
  );
};

export default JobDetails;
