export type JobStatus =
  | "All Jobs"
  | "In-Progress"
  | "Completed"
  | "Posted"
  | "Hold"; 

export interface Job {
  id: number;
  title: string;
  date: string;
  location: string;
  duration: string;
  serviceType: string;
  price: string;
  workMode: string;
  status: Exclude<JobStatus, "All Jobs">; // "All Jobs" is only for UI filter
}
