export type WorkMode = "Remote Only" | "On-site Only" | "On-site & Remote";

export type JobStatus = "All" | "In-Progress" | "Completed";

export interface Project {
  title: string;
  id: string;
  type: string;
  budget: string;
  duration: {
    start: string;
    end: string;
  };
  workMode: WorkMode;
  duration?: string;
  status: Exclude<JobStatus, "All">;
  onSiteCountries?: string[];
  remoteCountries?: string[];
  createdAt?: string;
  purchaseOrder?: string;
  jobTypeDetails: {
    type: string;
    hours: string;
  };
  description?: string;
  remainingbudget?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  distance?: number;
}
export interface JobCardHeaderProps {
  title: string;
  hours: number;
  client: string;
  status: "On Site" | "Remote" | "Pending";
  onApprove: () => void;
  onRequestRevision: () => void;
}

export interface JobCardProps {
  title: string;
  hours: number;
  client: string;
  status: "On Site" | "Remote" | "Pending";
  onApprove: () => void;
  onRequestRevision: () => void;
}

export type ProjectSite = {
  id: number;
  siteId: string;
  siteName: string;
  coordinates: [number, number];
};
export interface ProjectSiteForm {
  siteId: string;
  siteName: string;
  coordinates: [number, number];
}

export interface CreateProjectFormValues {
  projectName: string;
  projectType: string;
  description: string;
  budget: string;
  purchaseOrder: string;
  curency: string;
  scheduledStartDate: Date;
  scheduledEndDate: Date;

  // Engg level & discounts
  engineerLevel: string;
  discount: number;

  // Business hours
  businessHourFrom: string;
  businessHourTo: string;

  // Select / Multi-select fields
  engineersNeededFrom: string;
  group: string[];
  jobType: string[];
  locationType: string[];

  // Countries
  onSiteCoutry: string[];
  remoteCoutry: string[];

  // Addresses
  projectAddress: string;
  remoteServiceAddress: string;
}

export interface ServiceConfig {
  service: string;
  skill: string;
  sla: string;
  level: string;
  country: string;
  rate: string;
}
export interface ProjectMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
}
export interface ExistingFTMember {
  existingMember: string;
  role: string;
}
