import type { ChatMessage, ChatUser } from "@/pages/engineer/chat/types";

export const users: ChatUser[] = [
  { id: 1, name: "Jack Promp", avatar: "/avatars/jack.png" },
  { id: 2, name: "Emily Stone", avatar: "/avatars/emily.png" },
  { id: 3, name: "Robert Cole", avatar: "/avatars/robert.png" },
];

export const messages: ChatMessage[] = [
  {
    id: 1,
    userId: 1,
    fromMe: false,
    message: "Your payment for the job listing has been processed.",
    timestamp: "16:56",
  },
  {
    id: 2,
    userId: 1,
    fromMe: true,
    message: "Oh I'm sorry, may I see the bill receipt?",
    timestamp: "16:58",
  },
  {
    id: 3,
    userId: 1,
    fromMe: true,
    message: "Okay, I'll pay for it now.",
    timestamp: "16:59",
  },

  // Emily chat
  {
    id: 4,
    userId: 2,
    fromMe: false,
    message: "Hi, did you receive my resume?",
    timestamp: "15:10",
  },
  {
    id: 5,
    userId: 2,
    fromMe: true,
    message: "Yes! reviewing now.",
    timestamp: "15:11",
  },

  // Robert chat
  {
    id: 6,
    userId: 3,
    fromMe: false,
    message: "Is the meeting still scheduled?",
    timestamp: "11:00",
  },
];

export const quillContent = `
<h1>Hello User!</h1>
<p>This is a <strong>dummy example</strong> content for testing.</p>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
  <li>Point 3</li>
</ul>
`;
