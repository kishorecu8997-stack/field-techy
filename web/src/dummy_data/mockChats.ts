// mockChats.ts
export interface Participant {
  id: number;
  name: string;
  status: string;
  isGroup: boolean;
}

export interface Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  isCurrentUser: boolean; // new field
}

export interface Chat {
  jobId: string;
  jobCode: string;
  participant: Participant;
  messages: Message[];
}

export const mockChats: Chat[] = [
  {
    jobId: "1",
    jobCode: "JOB-001",
    participant: {
      id: 2,
      name: "Helen",
      status: "Online",
      isGroup: true,
    },
    messages: [
      {
        id: "1",
        sender: "Helen",
        message: "Reminder: submission deadline is tomorrow.",
        time: "2026-02-21T14:10:00.000Z",
        isCurrentUser: false,
      },
      {
        id: "2",
        sender: "Client",
        message: "Thanks for the update!",
        time: "2026-02-21T14:15:00.000Z",
        isCurrentUser: true,
      },
    ],
  },
  {
    jobId: "2",
    jobCode: "JOB-002",
    participant: { id: 3, name: "Michael", status: "Offline", isGroup: false },
    messages: [
      {
        id: "1",
        sender: "Michael",
        message: "Can we reschedule?",
        time: "2026-02-21T15:09:00.000Z",
        isCurrentUser: false,
      },
    ],
  },
  {
    jobId: "3",
    jobCode: "JOB-003",
    participant: { id: 4, name: "Team Alpha", status: "Online", isGroup: true },
    messages: [
      {
        id: "1",
        sender: "Team Alpha",
        message: "Meeting at 5 PM.",
        time: "2026-02-21T13:30:00.000Z",
        isCurrentUser: false,
      },
    ],
  },
];
