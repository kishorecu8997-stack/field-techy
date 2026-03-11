import { useClientGetAssignmentDetails } from "@/shared/apiServices/client/clientOpenApiService";
import JobOverviewSection from "@/shared/components/JobOverviewSection";
import TabComponent from "@/shared/components/TabComponent";
import { JOB_TAB_LABELS } from "@/shared/constants/jobTabs";
import { useEffect, useMemo, useState } from "react";
import type { JobTabSectionProps } from "../types";
// import JobInfoSection from "./tab_components/JobInfoSection";
import { useLookupData } from "@/shared/apiServices/commonOpenApiService";
import type { JobOverviewProps } from "@/shared/components/types";
import { useSearchParams } from "react-router-dom";
import LocationMap from "./tab_components/LocationMap";
import ManageProposalsTab from "./tab_components/ManageProposalsTab";
import TimelineSection from "./tab_components/timeline_section/TimelineSection";

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
 * Maps API job data to JobOverviewProps format for the Job Overview tab
 * Uses the existing JobOverviewSection component for comprehensive job details display
 */
const mapClientJobToJobOverview = (
  job: JobTabSectionProps["job"],
  skillMap: Map<number, string>,
  toolMap: Map<string, string>,
  experienceLevelMap: Map<number, string>,
  engagementModelMap: Map<number, string>,
): JobOverviewProps => {
  // Helper to safely cast job properties
  const getJobValue = <T,>(key: string): T | null | undefined => {
    return (job as Record<string, unknown>)?.[key] as T | null | undefined;
  };

  // Extract basic job info
  const jobTitle = job?.jobTitle || job?.title || "";
  const jobDescription = job?.jobDescription || "";

  // Extract skills - convert IDs to labels using skillMap
  const rawSkills = getJobValue<string[] | number[]>("skills");
  let skills: string[] = [];
  if (Array.isArray(rawSkills)) {
    skills = rawSkills.map((skill) => {
      const skillId = typeof skill === "string" ? parseInt(skill, 10) : skill;
      const skillLabel = skillMap.get(skillId);
      return skillLabel || String(skill);
    });
  }

  // Extract tools - convert IDs to labels using toolMap
  const rawTools = getJobValue<unknown>("tools");
  const toolAttachmentUrls = getJobValue<string[]>("toolAttachmentUrls") || [];
  let tools: Array<{ name: string; price: string; image?: string }> = [];

  // Helper function to convert tool ID to label
  const getToolLabel = (toolValue: string | number): string => {
    const toolId = String(toolValue);
    const toolLabel = toolMap.get(toolId);
    return toolLabel || String(toolValue);
  };

  const getToolPrice = (toolObj: Record<string, unknown>): string => {
    const candidate =
      toolObj.price ??
      toolObj.amount ??
      toolObj.budget ??
      toolObj.toolBudget ??
      toolObj.additionalBudget;
    return candidate !== undefined && candidate !== null
      ? String(candidate)
      : "";
  };

  const getToolImage = (
    toolObj: Record<string, unknown>,
  ): string | undefined => {
    const candidate =
      toolObj.image ??
      toolObj.imageUrl ??
      toolObj.toolImage ??
      toolObj.attachmentUrl ??
      toolObj.url;
    return typeof candidate === "string" && candidate.trim()
      ? candidate
      : undefined;
  };

  // Check for tools array first
  if (Array.isArray(rawTools) && rawTools.length > 0) {
    tools = rawTools
      .map((tool, index): { name: string; price: string; image?: string } => {
        if (typeof tool === "object" && tool !== null) {
          const toolObj = tool as Record<string, unknown>;
          const toolName = toolObj.name || toolObj.toolId || toolObj.id;
          return {
            name: toolName
              ? getToolLabel(toolName as string | number)
              : String(tool),
            price: getToolPrice(toolObj),
            image: getToolImage(toolObj),
          };
        }
        return {
          name: getToolLabel(tool as string | number),
          price: "",
          image: toolAttachmentUrls[index],
        };
      })
      .filter((t) => t.name && t.name !== "undefined");
  } else {
    // Check for individual tool fields: toolName, toolImage, toolAdditionalBudget
    const toolName = getJobValue<string>("toolName");
    const toolImage = getJobValue<string>("toolImage");
    const toolAdditionalBudget = getJobValue<string>("toolAdditionalBudget");

    if (toolName) {
      const toolNames = toolName
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const budgetParts = toolAdditionalBudget
        ? toolAdditionalBudget.split(",").map((b) => b.trim())
        : [];

      tools = toolNames
        .map((name, index) => ({
          name: getToolLabel(name),
          price: budgetParts[index] || "",
          image: index === 0 && toolImage ? toolImage : undefined,
        }))
        .filter((t) => t.name);
    }
  }

  // Fallback: when tools are numeric IDs, image URLs usually come via toolAttachmentUrls in the same order.
  if (tools.length > 0 && toolAttachmentUrls.length > 0) {
    tools = tools.map((tool, index) => ({
      ...tool,
      image: tool.image || toolAttachmentUrls[index],
    }));
  }

  // Extract duration from startDate and endDate
  const startDate = getJobValue<string>("startDate");
  const endDate = getJobValue<string>("endDate");
  let duration: string | undefined;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    duration = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;
  } else if (startDate) {
    duration = `Starts: ${new Date(startDate).toLocaleDateString("en-GB")}`;
  }

  // Extract work details - convert engagement model ID to label using engagementModelMap
  const engagementModelId =
    getJobValue<number>("engagementModelId") ??
    (getJobValue<string>("engagementModelId")
      ? parseInt(getJobValue<string>("engagementModelId")!, 10)
      : undefined);
  let engagementModel: string | undefined;
  if (engagementModelId && engagementModelMap.has(engagementModelId)) {
    engagementModel = engagementModelMap.get(engagementModelId);
  } else {
    // Fallback to direct field if no mapping found
    engagementModel =
      getJobValue<string>("jobType") ||
      getJobValue<string>("type") ||
      undefined;
  }

  // Extract experience level - try to convert ID to label using experienceLevelMap
  const experienceLevelId =
    getJobValue<string>("experienceLevelId") ||
    getJobValue<number>("experienceLevelId")?.toString();
  let experienceLevel: string | undefined;

  if (experienceLevelId) {
    const numericId = parseInt(experienceLevelId, 10);
    if (!isNaN(numericId)) {
      // Try to find in experience level map
      const levelLabel = experienceLevelMap.get(numericId);
      experienceLevel = levelLabel || experienceLevelId;
    } else {
      experienceLevel = experienceLevelId;
    }
  } else {
    // Fallback to string fields
    experienceLevel =
      getJobValue<string>("experienceLevel") ||
      getJobValue<string>("experience") ||
      undefined;
  }

  const numberOfVacancies = job?.vacancies ?? undefined;

  // Extract earnings info
  const totalPrice = getJobValue<string>("totalPrice");
  const currencySymbol = getJobValue<string>("currencySymbol") || "$";
  const weeklyPayRaw = getJobValue<string | number>("weeklyPay");
  const toolAllowanceRaw = getJobValue<string | number>("toolAllowance");
  // const weeklyPayNoteFromApi = getJobValue<string>("weeklyPayNote");

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
  // const weeklyPayNote =
  //   weeklyPayNoteFromApi ||
  //   "Weekly pay is paid every week. Tool allowance is paid once.";

  // Format total payment
  let totalPayment: string | undefined;
  if (totalPrice) {
    totalPayment = `${currencySymbol}${totalPrice}`;
  }

  // Extract additional details - ensure it's always an array
  const rawAdditionalDetails =
    getJobValue<string[]>("additionalDetails") ||
    getJobValue<string>("additionalDetails");
  let additionalDetails: string[] = [];
  if (Array.isArray(rawAdditionalDetails)) {
    additionalDetails = rawAdditionalDetails;
  } else if (typeof rawAdditionalDetails === "string" && rawAdditionalDetails) {
    additionalDetails = [rawAdditionalDetails];
  }

  // Extract attachments - show as "View Document" with the URL
  const attachments: Array<{ name: string; url: string }> = [];

  // Check for attachments array first
  const attachmentsArray = getJobValue<
    string[] | Array<{ name: string; url: string }>
  >("attachments");
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
    // weeklyPayNote,
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
  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");

  const parsedRegionId = Number(regionIdParam);
  const regionId = Number.isFinite(parsedRegionId) ? parsedRegionId : undefined;

  const initialTab =
    activeTab && activeTab !== JOB_TAB_LABELS.timeline
      ? activeTab
      : JOB_TAB_LABELS.jobOverview;
  const [selectedTab, setSelectedTab] = useState<string>(initialTab);
  const [hasUserSelectedTab, setHasUserSelectedTab] = useState(false);

  // Fetch assignments/proposals for this job when showManageProposals is true
  // Convert jobID to number, but handle invalid values properly
  const parsedJobId = jobID ? Number(jobID) : undefined;
  const validJobId =
    parsedJobId && !isNaN(parsedJobId) ? parsedJobId : undefined;
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useClientGetAssignmentDetails(
      { jobId: validJobId, regionId },
      Boolean(validJobId && regionId),
    );

  // Fetch skills, tools, experience levels and engagement models from the lookup API
  const { data: skillsResponse } = useLookupData("skills");
  const { data: toolsResponse } = useLookupData("tools");
  const { data: experienceLevelsResponse } = useLookupData("experienceLevels");
  const { data: engagementModelsResponse } = useLookupData("engagementModels");

  // Create skill lookup map for fast ID to label conversion from API data
  const skillMap = useMemo(() => {
    const map = new Map<number, string>();
    (skillsResponse || []).forEach((skill) => {
      map.set(skill.id, skill.name);
    });
    return map;
  }, [skillsResponse]);

  // Create tool lookup map for fast ID to label conversion from API data
  const toolMap = useMemo(() => {
    const map = new Map<string, string>();
    (toolsResponse || []).forEach((tool) => {
      map.set(String(tool.id), tool.name);
    });
    return map;
  }, [toolsResponse]);

  // Create experience level lookup map for fast ID to label conversion
  const experienceLevelMap = useMemo(() => {
    const map = new Map<number, string>();
    (experienceLevelsResponse || []).forEach((level) => {
      map.set(level.id, level.name);
    });
    return map;
  }, [experienceLevelsResponse]);

  // Create engagement model lookup map for fast ID to label conversion
  const engagementModelMap = useMemo(() => {
    const map = new Map<number, string>();
    (engagementModelsResponse || []).forEach((model) => {
      map.set(model.id, model.name);
    });
    return map;
  }, [engagementModelsResponse]);

  // Prepare job info for JobInfoSection using real API data
  // const jobInfo = mapClientJobToJobInfo(job);
  // const payInfo = mapClientJobToPayInfo(job);

  // Prepare job overview for JobOverviewSection using real API data
  const jobOverview = useMemo(
    () =>
      mapClientJobToJobOverview(
        job,
        skillMap,
        toolMap,
        experienceLevelMap,
        engagementModelMap,
      ),
    [job, skillMap, toolMap, experienceLevelMap, engagementModelMap],
  );

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
    "invited",
  ];
  const unprocessedProposalsCount =
    assignmentsData?.filter(
      (proposal) =>
        !processedStatuses.includes(
          (proposal.assignmentStatus || "").toLowerCase(),
        ),
    ).length || 0;

  const approvedStatuses = [
    "approved",
    "accepted",
    "assigned",
    "start_pending_approval",
    "started",
    "submit_pending_approval",
    "submitted",
  ];
  const hasApprovedProposal =
    assignmentsData?.some((proposal) =>
      approvedStatuses.includes(
        (proposal.assignmentStatus || "").toLowerCase().trim(),
      ),
    ) || false;

  const showTimelineTab = hasApprovedProposal;
  const defaultTabLabel = showTimelineTab
    ? JOB_TAB_LABELS.timeline
    : JOB_TAB_LABELS.jobOverview;

  useEffect(() => {
    if (hasUserSelectedTab || !activeTab) return;
    if (activeTab === JOB_TAB_LABELS.timeline && !showTimelineTab) {
      setSelectedTab(JOB_TAB_LABELS.jobOverview);
      return;
    }
    setSelectedTab(activeTab);
  }, [activeTab, showTimelineTab, hasUserSelectedTab]);

  useEffect(() => {
    if (!showTimelineTab && selectedTab === JOB_TAB_LABELS.timeline) {
      setSelectedTab(JOB_TAB_LABELS.jobOverview);
      return;
    }

    if (!hasUserSelectedTab && selectedTab !== defaultTabLabel) {
      setSelectedTab(defaultTabLabel);
    }
  }, [showTimelineTab, selectedTab, hasUserSelectedTab, defaultTabLabel]);

  // Simplified 3 tabs: Timeline, Job Overview, Work Location, Manage Proposals
  const tabs = [
    ...(showTimelineTab
      ? [
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
                      const status = (ass?.assignmentStatus || "")
                        .toLowerCase()
                        .trim();
                      const hasEngineer = !!ass?.engineer?.id;
                      return (
                        hasEngineer &&
                        (activeStatuses.some((s) => status.includes(s)) ||
                          status === "" ||
                          status === "pending")
                      );
                    });

                    // Group by unique engineerId to avoid duplicates
                    const assignmentsByEngineer = new Map<
                      number,
                      (typeof activeAssignments)[0]
                    >();
                    activeAssignments.forEach((ass) => {
                      const engineerId = ass.engineer?.id;
                      if (engineerId) {
                        // If we already have this engineer, prefer the one matching current assignmentId
                        const existing = assignmentsByEngineer.get(engineerId);
                        if (
                          !existing ||
                          (assignmentId && ass.assignmentId === assignmentId)
                        ) {
                          assignmentsByEngineer.set(engineerId, ass);
                        }
                      }
                    });

                    // Convert to array
                    const uniqueEngineerAssignments = Array.from(
                      assignmentsByEngineer.values(),
                    );

                    if (uniqueEngineerAssignments.length === 0) {
                      return (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border">
                          No active engineers assigned yet.
                        </div>
                      );
                    }

                    return uniqueEngineerAssignments.map((assignment) => {
                      return (
                      <div
                        key={`${assignment.engineer?.id}-${assignment.assignmentId}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800"
                      >
                        <TimelineSection
                          assignmentId={assignment.assignmentId}
                          jobId={validJobId}
                          hasProposals={false}
                          assignments={[assignment]}
                          regionId={Number(job?.regionId)}
                        />
                      </div>
                    )});
                  })()
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      label: JOB_TAB_LABELS.jobOverview,
      content: <JobOverviewSection {...jobOverview} userType="client" />,
    },
    {
      label: JOB_TAB_LABELS.workLocation,
      content: (
        <LocationMap
          workLocationLat={
            (job as Record<string, unknown>)?.workLocationLat as
              | string
              | null
              | undefined
          }
          workLocationLng={
            (job as Record<string, unknown>)?.workLocationLng as
              | string
              | null
              | undefined
          }
          workLocationName={
            (job as Record<string, unknown>)?.workLocationName as
              | string
              | null
              | undefined
          }
          cityId={job?.cityId as number | null | undefined}
          stateId={job?.stateId as number | null | undefined}
          countryId={job?.countryId as number | null | undefined}
        />
      ),
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
                regionId={job?.regionId ? Number(job.regionId) : undefined}
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
        defaultActiveTab={selectedTab}
        onTabChange={(tabLabel) => {
          setHasUserSelectedTab(true);
          setSelectedTab(tabLabel);
        }}
      />
    </div>
  );
};

export default JobTabSection;
