// Types

type JobOverViewStatus = "inprogress" | "completed" | "cancelled";
export interface JobOverview {
  id: number;
  title: string;
  count: number;
  status: JobOverViewStatus;
  buttonShow?: boolean;
}

export interface ServiceCategory {
  id: number;
  name: string;
  engineers: string;
}

export interface InProgressJob {
  id: number | string;
  title: string;
  date: string;
  location: string;
  duration: string;
  serviceType: string;
  price: string;
  engineers: string;
  engineerAvatars: string[];
  WorkLocationType: string;
  status?: string;
}

export interface Job {
  id: number | string;
  title?: string;
  client?: string;
  time?: string;
  description?: string;
  location?: string;
  salary?: string;
  postedTime?: string;
  category?: string;
  rating?: number;
  experience?: number;
  budgetType?: BudgetType | null;
  skills?: string[];
  startDate?: string;
  duration?: string;
  pay?: string;
  status?: JobStatus;
  type?: WorkingType;
  companyLogo?: string;
  company?: string;
  employmentType?: string;
  engineers?: string;
  engineerAvatars?: string[];
  serviceType?: string;
}
