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
  console.log("job form api", job);
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
    experience: job.experienceLevelId,
    salary: job.totalPrice,
    budgetType: null,
    cityId: job.cityId,
    stateId: job.stateId,
    countryId: job.countryId,
    skills: [],
    tools: [],
    toolImage: null,
    toolAdditionalBudget: null,
    status: job.status === "Posted" ? "NEW" : job.status || "NEW",
    postedTime: job.createdAt || "",
    jobDuration: "",
    client: {
      id: String(job.clientId),
      companyName: "client name ",
      contactPersonName: "N/A",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      state: "",
      clientType: "COMPANY",
    },
  } as JobItem;
};
