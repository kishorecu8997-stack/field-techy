import { useClientGetAssignmentDetails } from "@/shared/apiServices/client/clientOpenApiService";
import TabComponent from "@/shared/components/TabComponent";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import { useEffect, useState } from "react";
import type {
  JobInfoSectionProps,
  JobTabSectionProps,
  paymentTermsProps,
} from "../types";
// import JobInfoSection from "./tab_components/JobInfoSection";
import LocationMap from "./tab_components/LocationMap";
import ManageProposalsTab from "./tab_components/ManageProposalsTab";
import TimelineSection from "./tab_components/timeline_section/TimelineSection";
import type { JobOverviewProps } from "@/shared/components/types";
import skillsData from "@/dummy_data/skills.json";
import toolsData from "@/dummy_data/tools.json";

// Create skill lookup map for fast ID to label conversion
const skillMap = new Map<number, string>();
skillsData.skills.forEach((skill) => {
  skillMap.set(skill.id, skill.label);
});

// Create tool lookup map for fast ID to label conversion
const toolMap = new Map<string, string>();
toolsData.tools.forEach((tool) => {
  toolMap.set(tool.id, tool.label);
});

//future use
// // Helper function to get skill name from ID
// const getSkillName = (skillId: number | string): string => {
//   const id = typeof skillId === "string" ? parseInt(skillId, 10) : skillId;
//   return skillMap.get(id) || `Skill ${id}`;
// };

// // Helper function to get tool name from ID
// const getToolName = (toolId: string | number): string => {
//   const id = typeof toolId === "number" ? String(toolId) : toolId;
//   return toolMap.get(id) || `Tool ${id}`;
// };

/**
 * Maps API job data to JobInfoSectionProps format for the Job Overview tab
 * Uses job prop fields for backward compatibility
 */
const mapClientJobToJobInfo = (
  job: JobTabSectionProps["job"],
): JobInfoSectionProps => {
  const termsItems: Array<{ text: string }> = [];

  // Add job description as first term item if available
  if (job?.jobDescription) {
    termsItems.push({ text: job.jobDescription });
  }

  // Add start and end dates (from API response or fallback)
  const startDate = (job as Record<string, unknown>)?.startDate as
    | string
    | null
    | undefined;
  const endDate = (job as Record<string, unknown>)?.endDate as
    | string
    | null
    | undefined;

  if (startDate) {
    termsItems.push({
      text: `Start Date: ${new Date(startDate).toLocaleDateString()}`,
    });
  }
  if (endDate) {
    termsItems.push({
      text: `End Date: ${new Date(endDate).toLocaleDateString()}`,
    });
  }

  // Add total price/budget
  const totalPrice = (job as Record<string, unknown>)?.totalPrice as
    | string
    | null
    | undefined;
  const currencySymbol = (job as Record<string, unknown>)?.currencySymbol as
    | string
    | null
    | undefined;
  if (totalPrice && currencySymbol) {
    termsItems.push({ text: `Budget: ${currencySymbol}${totalPrice}` });
  }

  // Add work location
  const workLocationName = (job as Record<string, unknown>)
    ?.workLocationName as string | null | undefined;
  if (workLocationName) {
    termsItems.push({ text: `Location: ${workLocationName}` });
  }

  // Add job type
  const jobType = (job as Record<string, unknown>)?.jobType as
    | string
    | null
    | undefined;
  if (jobType) {
    termsItems.push({ text: `Work Type: ${jobType}` });
  }

  // Add additional details if available
  const additionalDetails = (job as Record<string, unknown>)
    ?.additionalDetails as string | null | undefined;
  if (additionalDetails) {
    termsItems.push({ text: additionalDetails });
  }

  // Handle attachment as file if available
  const files: Array<{ name: string; url: string }> = [];
  const attachmentUrl = (job as Record<string, unknown>)?.attachmentUrl as
    | string
    | null
    | undefined;
  if (attachmentUrl) {
    // Extract filename from URL, removing query string parameters
    const urlParts = attachmentUrl.split("/");
    const fileNameWithParams = urlParts[urlParts.length - 1] || "Job Attachment";
    const fileName = fileNameWithParams.split("?")[0] || "Job Attachment";
    files.push({ name: fileName, url: attachmentUrl });
  }

  return {
    jobTitle: job?.jobTitle || job?.title || "",
    terms: {
      title: "Job Details",
      items: termsItems,
    },
    files,
  };
};

/**
 * Maps API job data to paymentTermsProps format
 * Uses job prop fields for backward compatibility
 */
const mapClientJobToPayInfo = (
  job: JobTabSectionProps["job"],
): paymentTermsProps => {
  const totalPrice = (job as Record<string, unknown>)?.totalPrice as
    | string
    | null
    | undefined;
  const currencySymbol = (job as Record<string, unknown>)?.currencySymbol as
    | string
    | null
    | undefined;

  return {
    title: "Payment Terms",
    amount:
      totalPrice && currencySymbol ? `${currencySymbol}${totalPrice}` : "",
    priceType: "Fixed",
  };
};

/**
 * Maps API job data to JobOverviewProps format for the Job Overview tab
 * Uses the existing JobOverviewSection component for comprehensive job details display
 */
const mapClientJobToJobOverview = (
  job: JobTabSectionProps["job"],
): JobOverviewProps => {
  // Helper to safely cast job properties
  const getJobValue = <T,>(key: string): T | null | undefined => {
    return (job as Record<string, unknown>)?.[key] as T | null | undefined;
  };

  // Extract basic job info
  const jobTitle = job?.jobTitle || job?.title || "";
  const jobDescription = job?.jobDescription || "";

  // Extract skills - pass through exactly as backend returns (could be strings or numbers)
  const rawSkills = getJobValue<string[] | number[]>("skills");
  let skills: string[] = [];
  if (Array.isArray(rawSkills)) {
    skills = rawSkills.map((skill) => String(skill));
  }

  // Extract tools - pass through exactly as backend returns
  const rawTools = getJobValue<unknown>("tools");
  let tools: Array<{ name: string; price: string; image?: string }> = [];
  
  // Check for tools array first
  if (Array.isArray(rawTools) && rawTools.length > 0) {
    tools = rawTools.map((tool): { name: string; price: string; image?: string } => {
      if (typeof tool === "object" && tool !== null) {
        const toolObj = tool as Record<string, unknown>;
        return {
          name: String(toolObj.name || toolObj.id || JSON.stringify(tool)),
          price: String(toolObj.price || toolObj.amount || ""),
          image: toolObj.image as string | undefined,
        };
      }
      return { name: String(tool), price: "", image: undefined };
    }).filter(t => t.name && t.name !== "undefined");
  } else {
    // Check for individual tool fields: toolName, toolImage, toolAdditionalBudget
    const toolName = getJobValue<string>("toolName");
    const toolImage = getJobValue<string>("toolImage");
    const toolAdditionalBudget = getJobValue<string>("toolAdditionalBudget");
    
    if (toolName) {
      const toolNames = toolName.split(",").map(t => t.trim()).filter(t => t);
      const budgetParts = toolAdditionalBudget ? toolAdditionalBudget.split(",").map(b => b.trim()) : [];
      
      tools = toolNames.map((name, index) => ({
        name: name,
        price: budgetParts[index] || "",
        image: index === 0 && toolImage ? toolImage : undefined,
      })).filter(t => t.name);
    }
  }

  // Extract duration from startDate and endDate
  const startDate = getJobValue<string>("startDate");
  const endDate = getJobValue<string>("endDate");
  let duration: string | undefined;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    duration = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  } else if (startDate) {
    duration = `Starts: ${new Date(startDate).toLocaleDateString()}`;
  }

  // Extract work details
  const engagementModel = (getJobValue<string>("jobType") || getJobValue<string>("type")) || undefined;
  const experienceLevel = 
    getJobValue<string>("experienceLevel") || 
    getJobValue<string>("experience") || 
    getJobValue<string>("experienceLevelId") || 
    getJobValue<number>("experienceLevelId")?.toString() ||
    undefined;
  const numberOfVacancies = job?.vacancies ?? undefined;

  // Extract earnings info
  const totalPrice = getJobValue<string>("totalPrice");
  const currencySymbol = getJobValue<string>("currencySymbol") || "$";
  const weeklyPayRaw = getJobValue<string | number>("weeklyPay");
  const toolAllowanceRaw = getJobValue<string | number>("toolAllowance");
  const weeklyPayNoteFromApi = getJobValue<string>("weeklyPayNote");

  // Format weekly pay - could be a number or pre-formatted string
  let weeklyPay: string | undefined;
  if (weeklyPayRaw) {
    if (typeof weeklyPayRaw === "number") {
      weeklyPay = `${currencySymbol}${weeklyPayRaw.toLocaleString()}`;
    } else {
      weeklyPay = weeklyPayRaw;
    }
  }

  // Format tool allowance - could be a number or pre-formatted string
  let toolAllowance: string | undefined;
  if (toolAllowanceRaw) {
    if (typeof toolAllowanceRaw === "number") {
      toolAllowance = `${currencySymbol}${toolAllowanceRaw.toLocaleString()}`;
    } else {
      toolAllowance = toolAllowanceRaw;
    }
  }

  // Use provided weeklyPayNote or default to the standard message
  const weeklyPayNote = weeklyPayNoteFromApi || 
    "Weekly pay is paid every week. Tool allowance is paid once.";

  // Format total payment
  let totalPayment: string | undefined;
  if (totalPrice) {
    totalPayment = `${currencySymbol}${totalPrice}`;
  }

  // Extract additional details - ensure it's always an array
  const rawAdditionalDetails = getJobValue<string[]>("additionalDetails") || getJobValue<string>("additionalDetails");
  let additionalDetails: string[] = [];
  if (Array.isArray(rawAdditionalDetails)) {
    additionalDetails = rawAdditionalDetails;
  } else if (typeof rawAdditionalDetails === "string" && rawAdditionalDetails) {
    additionalDetails = [rawAdditionalDetails];
  }

  // Extract attachments - show as "View Document" with the URL
  const attachments: Array<{ name: string; url: string }> = [];
  
  // Check for attachments array first
  const attachmentsArray = getJobValue<string[] | Array<{ name: string; url: string }>>("attachments");
  if (Array.isArray(attachmentsArray)) {
    attachmentsArray.forEach((attachment) => {
      if (typeof attachment === "string" && attachment) {
        attachments.push({ name: "View Document", url: attachment });
      } else if (typeof attachment === "object" && attachment !== null) {
        const att = attachment as { name: string; url: string };
        if (att.url) {
          attachments.push({ name: att.name || "View Document", url: att.url });
        }
      }
    });
  } else {
    // Check for single attachmentUrl field
    const attachmentUrl = getJobValue<string>("attachmentUrl");
    if (attachmentUrl) {
      attachments.push({ name: "View Document", url: attachmentUrl });
    }
  }

  return {
    jobTitle,
    jobDescription,
    skills,
    tools,
    duration,
    engagementModel,
    experienceLevel,
    numberOfVacancies,
    weeklyPay,
    toolAllowance,
    totalPayment,
    weeklyPayNote,
    additionalDetails,
    attachments,
  };
};

/**
 * Client Job Tab Section with simplified 3-tab layout:
 * - Timeline
 * - Job Overview
 * - Work Location
 * - Manage Proposals (when showManageProposals is true)
 */
const JobTabSection: React.FC<JobTabSectionProps> = ({
  // status - kept for future use
  activeTab,
  job,
  assignmentId,
  showManageProposals,
  jobID,
  numberOfVacancy,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    activeTab || JOB_TAB_LABELS.timeline,
  );

  // Fetch assignments/proposals for this job when showManageProposals is true
  // Convert jobID to number, but handle invalid values properly
  const parsedJobId = jobID ? Number(jobID) : undefined;
  const validJobId =
    parsedJobId && !isNaN(parsedJobId) ? parsedJobId : undefined;
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useClientGetAssignmentDetails(
      { jobId: validJobId, assignmentId },
      !!(showManageProposals && (validJobId || assignmentId)),
    );

  useEffect(() => {
    if (selectedTab !== activeTab) {
      setSelectedTab?.(activeTab || "");
    }
  }, [selectedTab, activeTab]);

  // Prepare job info for JobInfoSection using real API data
  const jobInfo = mapClientJobToJobInfo(job);
  const payInfo = mapClientJobToPayInfo(job);

  // Prepare job overview for JobOverviewSection using real API data
  const jobOverview = mapClientJobToJobOverview(job);

  // Calculate unprocessed proposals count for badge notification
  const processedStatuses = [
    "accepted",
    "assigned",
    "approved",
    "start_pending_approval",
    "started",
    "submit_pending_approval",
    "submitted",
    "rejected",
  ];
  const unprocessedProposalsCount =
    assignmentsData?.filter(
      (proposal) =>
        !processedStatuses.includes(
          (proposal.assignmentStatus || "").toLowerCase(),
        ),
    ).length || 0;

  // Simplified 3 tabs: Timeline, Job Overview, Work Location, Manage Proposals
  const tabs = [
  {
    label: JOB_TAB_LABELS.timeline,
    content: (
      <div className="space-y-2 md:space-y-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm pt-4 pb-5 px-4 md:px-5 md:pt-5">
        {isLoadingAssignments ? (
          <div className="p-8 text-center text-gray-500">
            Loading engineers and timeline...
          </div>
        ) : !assignmentsData || assignmentsData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border">
            No engineers assigned yet.
          </div>
        ) : (
          // First, filter to active assignments and then group by unique engineer
          (() => {
            // Define active statuses
            const activeStatuses = [
              "assigned",
              "accepted",
              "started",
              "submitted",
              "start_pending_approval",
              "submit_pending_approval",
              "submit_pending",
              "in_progress",
              "active",
            ];

            // Filter to active assignments with engineers
            const activeAssignments = assignmentsData.filter((ass) => {
              const status = (ass?.assignmentStatus || "").toLowerCase().trim();
              const hasEngineer = !!ass?.engineer?.id;
              return hasEngineer && (
                activeStatuses.some((s) => status.includes(s)) ||
                status === "" ||
                status === "pending"
              );
            });

            // Group by unique engineerId to avoid duplicates
            const assignmentsByEngineer = new Map<number, typeof activeAssignments[0]>();
            activeAssignments.forEach((ass) => {
              const engineerId = ass.engineer?.id;
              if (engineerId) {
                // If we already have this engineer, prefer the one matching current assignmentId
                const existing = assignmentsByEngineer.get(engineerId);
                if (!existing || (assignmentId && ass.assignmentId === assignmentId)) {
                  assignmentsByEngineer.set(engineerId, ass);
                }
              }
            });

            // Convert to array
            const uniqueEngineerAssignments = Array.from(assignmentsByEngineer.values());

            if (uniqueEngineerAssignments.length === 0) {
              return (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border">
                  No active engineers assigned yet.
                </div>
              );
            }

            return uniqueEngineerAssignments.map((assignment) => (
              <div
                key={`${assignment.engineer?.id}-${assignment.assignmentId}`}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800"
              >
                <TimelineSection
                  assignmentId={assignment.assignmentId}
                  jobId={validJobId}
                  hasProposals={false}
                  assignments={[assignment]}
                />
              </div>
            ));
          })()
        )}
      </div>
    ),
  },
    {
      label: JOB_TAB_LABELS.jobOverview,
      content: <JobOverviewSection {...jobOverview} />,
    },
    {
      label: JOB_TAB_LABELS.workLocation,
      content: <LocationMap />,
    },
    // Add Manage Proposals tab when showManageProposals is true
    ...(showManageProposals
      ? [
          {
            label: JOB_TAB_LABELS.manageProposals || "Manage Proposals",
            badge:
              unprocessedProposalsCount > 0
                ? unprocessedProposalsCount
                : undefined,
            content: (
              <ManageProposalsTab
                assignments={assignmentsData}
                isLoading={isLoadingAssignments}
                jobId={Number(jobID)}
                numberOfVacancy={numberOfVacancy ?? job?.vacancies ?? undefined}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <TabComponent
        tabs={tabs}
        defaultActiveTab={activeTab || JOB_TAB_LABELS.timeline}
        onTabChange={(tabLabel) => {
          setSelectedTab(tabLabel);
        }}
      />
    </div>
  );
};

export default JobTabSection;
