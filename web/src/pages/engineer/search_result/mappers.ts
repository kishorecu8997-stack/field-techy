import type { EngineerSearchJobsResponse } from "@/api/types.gen";
import type { JobItem } from "../home/types";

/**
 * Maps an EngineerSearchJobsResponse item to a JobItem.
 *
 * @param job - The API job data
 * @returns {JobItem} The mapped JobItem
 */
export const mapApiJobToJobItem = (
  job: EngineerSearchJobsResponse[number],
): JobItem => {
  return {
    id: String(job.id),
    clientId: String(job.clientId),
    jobTitle: job.jobTitle,
    jobDescription: job.jobDescription || "",
    category: String(job.serviceCategoryId),
    jobType: job.jobType,
    engagementModel: job.engagementModelId,
    location: job.workLocationName,
    startDate: job.startDate || "",
    numberOfVacancy: job.vacancies || 1,
    assignedEngineerCount:
      (job as unknown as { assignedEngineerCount?: number })
        .assignedEngineerCount || 0,
    experience: job.experienceLevelId,
    salary: job.totalPrice,
    budgetType: null,
    cityId: job.cityId,
    stateId: job.stateId,
    countryId: job.countryId,
    skills: [],
    tools: [],
    toolImage: null,
    isSaved: job.isSaved,
    currencySymbol: job.currencySymbol || "$",
    toolAdditionalBudget: null,
    status: job.status === "Posted" ? "NEW" : job.status || "NEW",
    postedTime: job.createdAt || "",
    jobDuration: "",
    client: {
      id: String(job.clientId),
      companyName:
        job.clientDetails?.companyName || job.clientDetails?.personName || "",
      contactPersonName: job.clientDetails?.personName || "N/A",
      email: job.clientDetails?.email || "",
      phoneNumber: job.clientDetails?.phoneNumber || "",
      address: job.clientDetails?.address || "",
      city: "",
      country: "",
      postalCode: "",
      state: "",
      clientType:
        job.clientDetails?.clientType === "home" ? "INDIVIDUAL" : "COMPANY",
    },
    // Timestamp fields for job start
    startRequestedAt:
      (job as unknown as { startRequestedAt?: string | null }).startRequestedAt ||
      null,
    startedAt:
      (job as unknown as { startedAt?: string | null }).startedAt || null,
  } as JobItem;
};
