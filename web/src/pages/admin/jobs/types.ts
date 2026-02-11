import type { AdminGetJobsQuery, AdminGetJobsResponse } from "@/shared/apiServices/admin/adminOpenApiService";

export type JobItem = AdminGetJobsResponse["data"][number];
export interface JobByCategoryProps {
  data: JobItem[];
  filterType: AdminGetJobsQuery["jobType"] | undefined;
  setFilterType: (value: AdminGetJobsQuery["jobType"] | undefined) => void;
  filterBy: string | null;
  setFilterBy: (value: string | null) => void;
  filterRegion: string | null;
  setFilterRegion: (value: string | null) => void;
  serviceCategoryId: number | null;
  setServiceCategoryId: (value: number | null) => void;
  budget: string;
  setBudget: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  onClearFilters: () => void;
  showStatusSelect?: boolean;
  currentStatus?: AdminGetJobsQuery["status"] | undefined;
}


export interface JobDataProps {
  id: string;
  clientDetails: {
    name: string;
    email: string;
    phone: string;
  };
  engineerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  company: string;
  title: string;
  description: string;
  companyLogo: string;
  category: string;
  jobType: string;
  locationType: string;
  salary: string;
  country: string;
  state: string;
  city: string;
  createdDate: string;
  status: "completed" | "pending" | "in-progress";
}

export interface PaymentListProps {
  id: string | number;
  amount: string;
  clientStatus: string;
  adminStatus: string;
}

export const ALL_JOBS_STATUS = {
  approve: "Approve",
  reject: "Reject",
} as const;
export type adminJobsStatus =
  (typeof ALL_JOBS_STATUS)[keyof typeof ALL_JOBS_STATUS];

export interface ManageJobProps {
  id: number;
  postedBy: {
    name: string;
    email: string;
  };
  jobTitle: string;
  jobDescription: string;
  category: string;
  status?: adminJobsStatus;
  jobType: string;
  jobPrice: string;
  priority: string;
  country: string;
  state: string;
  city: string;
  startDate: string;
  createdDate: string;
  approvalStatus: string;
}

//Manage Flagged Jobs
export interface ManageFlaggedJobProps {
  id: number;
  postedBy: {
    name: string;
    email: string;
  };
  jobTitle: string;
  jobDescription: string;
  issueCategory: string;
  issueDescription: string;
  priority: string;
  createdDate: string;
}
