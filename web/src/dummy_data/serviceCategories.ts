export interface ServiceOption {
  value: string;
  label: string;
}

export const serviceCategories: ServiceOption[] = [
  { value: "network-engineer", label: "Network Engineer" },
  { value: "software-engineer", label: "Software Engineer" },
  { value: "full-stack-engineer", label: "Full Stack Engineer" },
  { value: "cybersecurity-engineer", label: "Cybersecurity Engineer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "frontend-engineer", label: "Frontend Engineer" },
  { value: "backend-engineer", label: "Backend Engineer" },
  { value: "mobile-app-engineer", label: "Mobile App Engineer" },
  { value: "cloud-engineer", label: "Cloud Engineer" },
  { value: "qa-test-engineer", label: "QA / Test Engineer" },
  { value: "system-engineer", label: "System Engineer" },
  { value: "data-engineer", label: "Data Engineer" },
  { value: "ai-ml-engineer", label: "AI / ML Engineer" },
  { value: "embedded-systems-engineer", label: "Embedded Systems Engineer" },
  { value: "security-engineer", label: "Security Engineer" },
];

export default serviceCategories;
