// Types

type JobOverViewStatus = "inprogress" | "completed" | "cancelled";
export interface JobOverview {
  id: number;
  title: string;
  count: number;
  status: JobOverViewStatus;
  buttonShow?:boolean;
}


export interface ServiceCategory {
  id: number;
  name: string;
  engineers: string;
  image: string;
}

export interface InProgressJob {
  id: number;
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