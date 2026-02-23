export interface AdminReportIssue {
  id: number;
  name: string;
  tokenId: string;
  email: string;
  issue: string; // e.g. issue title or short name
  category: string; // e.g. Bug, UI/UX, Performance, Security, Feature Request
  level: string; // e.g. Critical, High, Medium, Low
  date: string;
  phone: string;
  size: string;
  file: string;
  position: string;
  solved: boolean;
}

export const sampleReportsIssue: AdminReportIssue[] = [
  {
    id: 1,
    name: "john_dev92",
    tokenId: "tok_8f3k9p2m",
    email: "john92@example.com",
    issue: "Login button not responding on mobile",
    category: "UI/UX",
    level: "Level-1",
    date: "2025-02-12",
    phone: "0112345632",
    size: "1.2MB",
    file: "mobile_screenshot.png",
    position: "Frontend Developer",
    solved: false,
  },
  {
    id: 2,
    name: "sarah_qa",
    tokenId: "tok_x7n4q8v1",
    email: "sarah.qa@company.io",
    issue: "500 Internal Server Error on payment endpoint",
    category: "Backend",
    level: "Level-2",
    date: "2025-02-14",
    phone: "021234563",
    size: "45KB",
    file: "server_logs.txt",
    position: "QA Automation Engineer",
    solved: false,
  },
  {
    id: 3,
    name: "mike_tester",
    tokenId: "tok_p9m2r5t7",
    email: "mike.test@testing.dev",
    issue: "Dashboard charts not loading after 10s idle",
    category: "Performance",
    level: "Level-3",
    date: "2025-02-15",
    phone: "023234533",
    size: "2.5MB",
    file: "network_profile.json",
    position: "Performance Engineer",
    solved: false,
  },
  {
    id: 4,
    name: "emma_ui",
    tokenId: "tok_z3k8w4q9",
    email: "emma.ui@design.studio",
    issue: "Dark mode text contrast fails WCAG AA",
    category: "Accessibility",
    level: "Level-1",
    date: "2025-02-16",
    phone: "0112342336",
    size: "850KB",
    file: "contrast_report.pdf",
    position: "UI/UX Designer",
    solved: false,
  },
  {
    id: 5,
    name: "alex_backend",
    tokenId: "tok_h6j1y9r2",
    email: "alex@backend.team",
    issue: "JWT token refresh fails intermittently",
    category: "Authentication",
    level: "Level-3",
    date: "2025-02-17",
    phone: "0212315643",
    size: "120KB",
    file: "auth_trace.log",
    position: "Backend Developer",
    solved: false,
  },
  {
    id: 6,
    name: "guest_user123",
    tokenId: "tok_g4v8n3m6",
    email: "guest123@temp.mail",
    issue: "Add 'Export to CSV' button on reports page",
    category: "Feature Request",
    level: "Level-2",
    date: "2025-02-18",
    phone: "0212315643",
    size: "4.1MB",
    file: "mockup_v1.fig",
    position: "Product Manager",
    solved: false,
  },
];
