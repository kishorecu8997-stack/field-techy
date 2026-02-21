export interface ReportIssue {
  id: number;
  name: string;
  issue: string; // e.g. issue title or short name
  category: string; // e.g. Bug, UI/UX, Performance, Security, Feature Request
  level: string; // e.g. Critical, High, Medium, Low
}

export const sampleReportsIssue: ReportIssue[] = [
  {
    id: 1,
    name: "john_dev92",
    issue: "Login button not responding on mobile",
    category: "UI/UX",
    level: "Level-1",
  },
  {
    id: 2,
    name: "sarah_qa",
    issue: "500 Internal Server Error on payment endpoint",
    category: "Backend",
    level: "Level-2",
  },
  {
    id: 3,
    name: "mike_tester",
    issue: "Dashboard charts not loading after 10s idle",
    category: "Performance",
    level: "Level-3",
  },
  {
    id: 4,
    name: "emma_ui",
    issue: "Dark mode text contrast fails WCAG AA",
    category: "Accessibility",
    level: "Level-2",
  },
  {
    id: 5,
    name: "alex_backend",
    issue: "JWT token refresh fails intermittently",
    category: "Authentication",
    level: "Level-3",
  },
  {
    id: 6,
    name: "guest_user123",
    issue: "Add 'Export to CSV' button on reports page",
    category: "Feature Request",
    level: "Level-1",
  },
];
