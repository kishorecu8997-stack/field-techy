// src/dummy_data/personalChatData.ts
import user from "../assets/user.png";

export interface PersonalChatUser {
  id: number;
  name: string;
  role: string;
  avatar: string; // URL or initials like "AH"
  status: "Online" | "Offline";
}

export const mockPersonalChatUsers: PersonalChatUser[] = [
  {
    id: 1,
    name: "Alvin Harris",
    role: "Technician",
    avatar: user,
    status: "Online",
  },
  {
    id: 2,
    name: "Jill Claire",
    role: "Angular Developer",
    avatar: user,
    status: "Online",
  },
  {
    id: 3,
    name: "Emily Jane",
    role: "Python Developer",
    avatar: user,
    status: "Online",
  },
  {
    id: 4,
    name: "Jack Promp",
    role: "Python Developer",
    avatar: user,
    status: "Online",
  },
  {
    id: 5,
    name: "Alvin Harris",
    role: "Technician",
    avatar: user,
    status: "Online",
  },
  {
    id: 6,
    name: "Jill Claire",
    role: "Angular Developer",
    avatar: user,
    status: "Online",
  },
];
