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
    email: "john@gmail.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Off",
  },
  {
    id: 2,
    name: "Alex",
    email: "alex@gmail.com",
    phoneNumber: "+91 9854728765",
    roleName: "Team Lead",
    status: "Off",
  },
  {
    id: 3,
    name: "david",
    email: "david@gmail.com",
    phoneNumber: "+91 9476382565",
    roleName: "Admin",
    status: "Off",
  },
  {
    id: 4,
    name: "kiran",
    email: "kiran@gmail.com",
    phoneNumber: "+91 9787457811",
    roleName: "Super Admin",
    status: "On",
  },
];

export const SubAdminRoles = [
  { value: "Admin", label: "Admin" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Team Lead", label: "Team Lead" },
];
