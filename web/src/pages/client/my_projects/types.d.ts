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
