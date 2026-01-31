const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const mockChat = [
  {
    id: generateId(),
    sender: "support",
    message: "Hi! How can I help you today?",
  },
  {
    id: generateId(),
    sender: "user",
    message: "I need help with my job application.",
  },
  {
    id: generateId(),
    sender: "support",
    message: "Sure! I can guide you step by step.",
  },
];
