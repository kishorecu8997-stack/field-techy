export interface UserItem {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  status: "On" | "Off";
}

export const userList: UserItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "rock@gmil.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Off",
  },
  {
    id: 2,
    name: "John Doe",
    email: "rock@gmil.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Off",
  },
  {
    id: 3,
    name: "John Doe",
    email: "rock@gmil.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Off",
  },
  {
    id: 4,
    name: "John Doe",
    email: "rock@gmil.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Off",
  },
];

export const SubAdminRoles = [
  { value: "admin", label: "Admin" },
  { value: "superAdmin", label: "Super Admin" },
  { value: "manager", label: "Manager" },
  { value: "TeamLead", label: "Team Lead" },
];
