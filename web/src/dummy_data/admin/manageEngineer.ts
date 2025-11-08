interface ManageEngineerProps {
  id: number;
  engineerID: string;
  details: string;
  documents: string;
  location: string;
  registrationDate: string;
  walletBalance: string;
  kycStatus: string;
  employementStatus: string;
  avgRating: number;
  approvalStatus: string;
}

export const manageEngineer: ManageEngineerProps[] = [
  {
    id: 1,
    engineerID: "ENG-1001",
    details: "Experienced HVAC technician with 5 years in field service.",
    documents: "View",
    location: "Mumbai, India",
    registrationDate: "2024-02-15",
    walletBalance: "₹2,500",
    kycStatus: "Verified",
    employementStatus: "Active",
    avgRating: 4.7,
    approvalStatus: "Approved",
  },
  {
    id: 2,
    engineerID: "ENG-1002",
    details: "Junior electrical engineer, recently certified.",
    documents: "View",
    location: "Pune, India",
    registrationDate: "2024-03-10",
    walletBalance: "₹1,200",
    kycStatus: "Pending",
    employementStatus: "Inactive",
    avgRating: 3.9,
    approvalStatus: "Under Review",
  },
  {
    id: 3,
    engineerID: "ENG-1003",
    details: "Field engineer specializing in solar panel installations.",
    documents: "View",
    location: "Bangalore, India",
    registrationDate: "2024-05-21",
    walletBalance: "₹4,800",
    kycStatus: "Verified",
    employementStatus: "Active",
    avgRating: 4.5,
    approvalStatus: "Approved",
  },
  {
    id: 4,
    engineerID: "ENG-1004",
    details: "Mechanical technician with expertise in refrigeration systems.",
    documents: "View",
    location: "Delhi, India",
    registrationDate: "2024-06-30",
    walletBalance: "₹3,100",
    kycStatus: "Rejected",
    employementStatus: "Suspended",
    avgRating: 3.4,
    approvalStatus: "Rejected",
  },
  {
    id: 5,
    engineerID: "ENG-1005",
    details: "Electrical maintenance expert, certified by IEEMA.",
    documents: "View",
    location: "Hyderabad, India",
    registrationDate: "2024-07-14",
    walletBalance: "₹6,000",
    kycStatus: "Verified",
    employementStatus: "Active",
    avgRating: 4.9,
    approvalStatus: "Approved",
  },
];
