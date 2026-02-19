export interface UserItem {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  status: "Active" | "Disabled";
}

export const userList: UserItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    phoneNumber: "+91 9861234567",
    roleName: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Alex",
    email: "alex@gmail.com",
    phoneNumber: "+91 9854728765",
    roleName: "Team Lead",
    status: "Disabled",
  },
  {
    id: 3,
    name: "david",
    email: "david@gmail.com",
    phoneNumber: "+91 9476382565",
    roleName: "Admin",
    status: "Active",
  },
  {
    id: 4,
    name: "kiran",
    email: "kiran@gmail.com",
    phoneNumber: "+91 9787457811",
    roleName: "Super Admin",
    status: "Active",
  },
];

export const SubAdminRegions = [
  { value: "UK", label: "UK" },
  { value: "India", label: "India" },
  { value: "Sri Lanka", label: "Sri Lanka" },
];
