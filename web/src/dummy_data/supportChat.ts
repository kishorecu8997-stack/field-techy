const generateId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
};
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
