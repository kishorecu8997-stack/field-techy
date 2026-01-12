export interface SearchEvent {
  id: string;
  keyword: string;
  searchedAt: string;
}

export interface ClickEvent {
  searchId: string;
  jobId: string;
  clickedAt: string;
}

export const searchEvents: SearchEvent[] = [
  { id: "1", keyword: "React Developer", searchedAt: "2025-01-01T10:00:00Z" },
  { id: "2", keyword: "Frontend Engineer", searchedAt: "2025-01-02T11:15:00Z" },
  { id: "3", keyword: "React Developer", searchedAt: "2025-01-03T09:30:00Z" },
  { id: "4", keyword: "Node.js Developer", searchedAt: "2025-01-03T15:45:00Z" },
  { id: "5", keyword: "React Developer", searchedAt: "2025-01-04T08:20:00Z" },
];

export const clickEvents: ClickEvent[] = [
  { searchId: "1", jobId: "JOB-101", clickedAt: "2025-01-01T10:02:00Z" },
  { searchId: "1", jobId: "JOB-102", clickedAt: "2025-01-01T10:05:00Z" },
  { searchId: "3", jobId: "JOB-103", clickedAt: "2025-01-03T09:35:00Z" },
];
