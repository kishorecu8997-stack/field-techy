/**
 * Represents a single call log entry.
 */
export interface CallLog {
  id: string;
  name: string;
  isGroup: boolean;
  time: string;
  callType: "incoming" | "missed" | "outgoing";
  duration?: string;
  callIcon: "voice" | "video";
}

export const defaultMockCallLogs: CallLog[] = [
  {
    id: "1",
    name: "Kraft And Co (Client)",
    isGroup: false,
    time: "10:00 am",
    callType: "incoming",
    duration: "1 min 12 sec",
    callIcon: "voice",
  },
  {
    id: "2",
    name: "Kraft And Co (Client)",
    isGroup: false,
    time: "10:00 am",
    callType: "missed",
    callIcon: "video",
  },
  {
    id: "3",
    name: "Job-001",
    isGroup: true,
    time: "10:00 am",
    callType: "outgoing",
    duration: "1 min 12 sec",
    callIcon: "voice",
  },
];