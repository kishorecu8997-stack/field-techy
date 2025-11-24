export interface WorkType {
  id: string;
  type: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  category: string;
  description: string;
}

export type RatePreference = 'Hourly' | 'Fixed';

export interface WorkPreference {
  portfolioLink: string;
  preferredWorkTypeIds: string;
  serviceCategoryIds: string;  
  ratePreference: string;
}

export const preferredWorkTypes: WorkType[] = [
  { id: "1", type: "Full-Time", description: "Standard full working hours, typically 35–40 hours per week." },
  { id: "2", type: "Part-Time", description: "Fewer hours than full-time, often flexible or scheduled shifts." },
  { id: "3", type: "Contract", description: "Fixed-term employment based on a contract agreement." },
  { id: "4", type: "Freelance", description: "Project-based or hourly work as an independent contributor." },
  { id: "5", type: "Internship", description: "Temporary position for students or trainees to gain experience." },
  { id: "6", type: "Remote", description: "Work performed entirely from a remote location." },
  { id: "7", type: "Hybrid", description: "Combination of remote and on-site work." }
];

export const servicesCategories: ServiceCategory[] = [
  { id: "1", category: "Web Development", description: "Frontend, backend, and full-stack web application development." },
  { id: "2", category: "UI/UX Design", description: "User interface and experience design, wireframing, prototyping." },
  { id: "3", category: "Mobile App Development", description: "iOS and Android application development." },
  { id: "4", category: "DevOps & Infrastructure", description: "CI/CD pipelines, cloud deployment, containerization." },
  { id: "5", category: "Data Engineering", description: "ETL pipelines, data modeling, and database optimization." },
  { id: "6", category: "QA & Testing", description: "Manual and automated testing, test case design, bug tracking." },
  { id: "7", category: "Technical Writing", description: "Documentation, API references, user manuals." },
  { id: "8", category: "Graphic Design", description: "Branding, illustration, and visual content creation." },
  { id: "9", category: "IT Support", description: "Helpdesk, troubleshooting, and system maintenance." },
  { id: "10", category: "Consulting", description: "Technology strategy, architecture, and process improvement." }
];


export const workPreferenceData: WorkPreference[] = [
  {
    portfolioLink: "https://www.linkedin.com/in/nick",
    preferredWorkTypeIds: "4",
    serviceCategoryIds: "1",
    ratePreference: "250"
  },  
];


export const workTypeMap = new Map(preferredWorkTypes.map(wt => [wt.id, wt]));
export const serviceCategoryMap = new Map(servicesCategories.map(sc => [sc.id, sc]));