export interface Session {
  id: string;
  startTime: string;
  device: string;
  lastActivity?: string;
  browser?: string;
  location?: string;
  isCurrent?: boolean;
}

export const mockSessions: Session[] = [
  {
    id: "1",
    startTime: "2025-12-16T10:00:00Z",
    device: "Desktop - Windows",
    isCurrent: false,
  },
  {
    id: "2",
    startTime: "2025-12-16T11:30:00Z",
    device: "iPhone 15",
    isCurrent: true,
  },
  {
    id: "3",
    startTime: "2025-12-16T12:00:00Z",
    device: "iPad Pro",
    isCurrent: false,
  },
  {
    id: "4",
    startTime: "2025-12-16T13:15:00Z",
    device: "MacBook Air",
    isCurrent: false,
  },
  {
    id: "5",
    startTime: "2025-12-16T14:45:00Z",
    device: "Android TV",
    isCurrent: false,
  },
  {
    id: "6",
    startTime: "2025-12-16T15:30:00Z",
    device: "Linux Desktop",
    isCurrent: false,
  },
  {
    id: "7",
    startTime: "2025-12-16T16:00:00Z",
    device: "Chrome on Android",
    isCurrent: false,
  },
  {
    id: "8",
    startTime: "2025-12-10T09:30:00Z",
    device: "Chrome on Windows",
    isCurrent: false,
  },
  {
    id: "9",
    startTime: "2025-12-12T14:15:00Z",
    device: "Safari on iPhone",
    isCurrent: false,
  },
  {
    id: "10",
    startTime: "2025-12-14T21:45:00Z",
    device: "Firefox on macOS",
    isCurrent: false,
  },
  {
    id: "11",
    startTime: "2025-12-15T07:05:00Z",
    device: "Edge on Windows",
    isCurrent: false,
  },
  {
    id: "12",
    startTime: "2025-12-16T16:00:00Z",
    device: "Chrome on Android",
    isCurrent: true,
  },
];
