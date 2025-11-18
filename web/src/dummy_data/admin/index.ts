import type { ServerCategoryProps } from "@/pages/admin/job_category";
import type { PaymentProps } from "@/pages/admin/payment/types";
import type {
  PermissionListType,
  RoleListType,
} from "@/pages/admin/sub_admin/types";
import type { RateCardProps } from "@/pages/admin/rate_card/types";
import type { NotificationProps } from "./manageNotification";
import type { EngineerPage, TransactionRequest } from "@/pages/admin/wallet_management/wallet_overview/types";

export const serviceCategoriesData: ServerCategoryProps[] = [
  {
    id: "REQ-001",
    categoryImg: "/images/ac-repair.png",
    categoryName: "AC Repair & Maintenance",
    createdDate: "2024-11-01",
    status: true,
  },
  {
    id: "REQ-002",
    categoryImg: "/images/plumbing.png",
    categoryName: "Plumbing Services",
    createdDate: "2024-10-28",
    status: false,
  },
  {
    id: "REQ-003",
    categoryImg: "/images/electrical.png",
    categoryName: "Electrical Wiring & Fixing",
    createdDate: "2024-10-15",
    status: true,
  },
  {
    id: "REQ-004",
    categoryImg: "/images/cleaning.png",
    categoryName: "Home Deep Cleaning",
    createdDate: "2024-09-30",
    status: false,
  },
  {
    id: "REQ-005",
    categoryImg: "/images/painting.png",
    categoryName: "Interior Painting",
    createdDate: "2024-09-25",
    status: true,
  },
];

export const RateCardData: RateCardProps[] = [
  {
    id: "1",
    skillSet: "Electrical Maintenance",
    region: "West",
    location: "Mumbai, India",
    rate: "₹4,800",
    rateType: "Hourly",
    project: "Residential Power Backup Installation",
    createdDate: "2024-11-01",
    status: true,
  },
  {
    id: "2",
    skillSet: "HVAC Technician",
    region: "South",
    location: "Bangalore, India",
    rate: "₹2,500",
    rateType: "Per Project",
    project: "Commercial AC Setup",
    createdDate: "2024-10-22",
    status: true,
  },
  {
    id: "3",
    skillSet: "Plumbing",
    region: "North",
    location: "Delhi, India",
    rate: "₹3,100",
    rateType: "Hourly",
    project: "Corporate Office Maintenance",
    createdDate: "2024-09-15",
    status: false,
  },
  {
    id: "4",
    skillSet: "Solar Panel Installation",
    region: "West",
    location: "Pune, India",
    rate: "₹1,200",
    rateType: "Per Project",
    project: "Industrial Solar Deployment",
    createdDate: "2024-08-12",
    status: true,
  },
  {
    id: "5",
    skillSet: "Painting & Finishing",
    region: "South",
    location: "Chennai, India",
    rate: "₹4,500",
    rateType: "Daily",
    project: "Apartment Interior Painting",
    createdDate: "2024-07-25",
    status: false,
  },
];

export const PaymentData: PaymentProps[] = [
  {
    id: "RC-001",
    clientDetails: {
      name: "ABC Industries",
      email: "abc@abc.com",
      phone: "1234567890",
    },
    jobTitle: "Electrical Maintenance",
    jobDescription:
      "Routine inspection and repair of industrial electrical systems.",
    amount: "$15,000",
    engineerDetails: "Rahul Mehta (ENG-1021)",
    clientStatus: "Approved",
    adminStatus: "Verified",
  },
  {
    id: "RC-002",
    clientDetails: {
      name: "Green Energy Co.",
      email: "greenenergy@co.com",
      phone: "0987654321",
    },
    jobTitle: "Solar Panel Installation",
    jobDescription: "Complete rooftop solar setup for a 5KW system.",
    amount: "$42,000",
    engineerDetails: "Priya Sharma (ENG-1044)",
    clientStatus: "Pending",
    adminStatus: "Under Review",
  },
  {
    id: "RC-003",
    clientDetails: {
      name: "BlueLine Apartments",
      email: "blueline@apartments.com",
      phone: "1122334455",
    },
    jobTitle: "Plumbing Overhaul",
    jobDescription:
      "Replacement of old water lines and fixtures across 12 units.",
    amount: "$28,500",
    engineerDetails: "Vikram Rao (ENG-1009)",
    clientStatus: "In Progress",
    adminStatus: "Approved",
  },
  {
    id: "RC-004",
    clientDetails: {
      name: "SmartLiving Interiors",
      email: "smartliving@interiors.com",
      phone: "6677889900",
    },
    jobTitle: "Interior Electrical Setup",
    jobDescription: "Full wiring and lighting setup for new luxury apartment.",
    amount: "$36,000",
    engineerDetails: "Sneha Patel (ENG-1078)",
    clientStatus: "Completed",
    adminStatus: "Approved",
  },
  {
    id: "RC-005",
    clientDetails: {
      name: "Urban Spaces Ltd.",
      email: "urbanspaces@ltd.com",
      phone: "5566778899",
    },
    jobTitle: "HVAC System Installation",
    jobDescription:
      "Air conditioning and ventilation setup for office floors 3–6.",
    amount: "$55,000",
    engineerDetails: "Amit Verma (ENG-1035)",
    clientStatus: "Cancelled",
    adminStatus: "Rejected",
  },
];

export const notifications: NotificationProps[] = [
  {
    id: 1,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 2,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 3,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 4,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 5,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
  {
    id: 6,
    title: "What is Lorem Ipsum?",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s",
    type: "broadcast",
    sendTo: "Users",
    createdDate: "1 Nov, 2024",
  },
];

export const permissionList: PermissionListType[] = [
  {
    id: "1",
    moduleName: "Rate Card",
    addAndEdit: true,
    view: true,
    delete: false,
  },
  {
    id: "2",
    moduleName: "Notification",
    addAndEdit: true,
    view: false,
    delete: true,
  },
  {
    id: "3",
    moduleName: "Job Category",
    addAndEdit: true,
    view: true,
    delete: false,
  },
  {
    id: "4",
    moduleName: "Sub Admin",
    addAndEdit: true,
    view: true,
    delete: true,
  },
  {
    id: "5",
    moduleName: "Payment",
    addAndEdit: true,
    view: true,
    delete: false,
  },
];

export const roleData: RoleListType[] = [
  {
    id: "1",
    roleName: "Manage Clients",
    status: true,
    permissionList: [
      {
        id: "1",
        moduleName: "Rate Card",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "2",
        moduleName: "Notification",
        addAndEdit: true,
        view: false,
        delete: true,
      },
      {
        id: "3",
        moduleName: "Job Category",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "4",
        moduleName: "Sub Admin",
        addAndEdit: true,
        view: true,
        delete: true,
      },
    ],
  },
  {
    id: "2",
    roleName: "Manage Payment",
    status: true,
    permissionList: [
      {
        id: "1",
        moduleName: "Rate Card",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "2",
        moduleName: "Notification",
        addAndEdit: true,
        view: false,
        delete: true,
      },
      {
        id: "3",
        moduleName: "Job Category",
        addAndEdit: true,
        view: true,
        delete: false,
      },
    ],
  },
  {
    id: "3",
    roleName: "Manage Rate Card",
    status: true,
    permissionList: [
      {
        id: "1",
        moduleName: "Rate Card",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "2",
        moduleName: "Notification",
        addAndEdit: true,
        view: false,
        delete: true,
      },
      {
        id: "3",
        moduleName: "Job Category",
        addAndEdit: true,
        view: true,
        delete: false,
      },
    ],
  },
  {
    id: "4",
    roleName: "Manage Clients",
    status: true,
    permissionList: [
      {
        id: "1",
        moduleName: "Rate Card",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "2",
        moduleName: "Notification",
        addAndEdit: true,
        view: false,
        delete: true,
      },
      {
        id: "3",
        moduleName: "Job Category",
        addAndEdit: true,
        view: true,
        delete: false,
      },
      {
        id: "4",
        moduleName: "Sub Admin",
        addAndEdit: true,
        view: true,
        delete: true,
      },
    ],
  },
];
export const rateCardTypes = [
  { label: "Master Rate Card", value: "masterRateCard" },
  { label: "Client Specific Rate Card", value: "clientSpecificRateCard" },
  { label: "Project Specific Rate Card", value: "projectSpecificRateCard" },
];

export const ClientNameList = [
  { label: "Client 1", value: "client1" },
  { label: "Client 2", value: "client2" },
  { label: "Client 3", value: "client3" },
];

export const projectNameList = [
  { label: "Project 1", value: "project1" },
  { label: "Project 2", value: "project2" },
  { label: "Project 3", value: "project3" },
];

export const regionList = [
  { label: "Region 1", value: "region1" },
  { label: "Region 2", value: "region2" },
  { label: "Region 3", value: "region3" },
];

export const countryList = [
  { label: "Country 1", value: "country1" },
  { label: "Country 2", value: "country2" },
  { label: "Country 3", value: "country3" },
];



export const transactionRequest: TransactionRequest[] = [
  {
    sno: 1,
    details: {
      name: "Arjun Mehta",
      phone: "+91 98765 43210",
    },
    status:"approved",
    walletBalance: 12500.75,
  },
  {
    sno: 2,
    details: {
      name: "Priya Sharma",
      phone: "+91 99887 65432",
    },
    status:"approved",
    walletBalance: 8450.0,
  },
  {
    sno: 3,
    details: {
      name: "Rohit Verma",
      phone: "+91 91234 56789",
    },
    status:"rejected",
    walletBalance: 15780.5,
  },
  {
    sno: 4,
    details: {
      name: "Sneha Iyer",
      phone: "+91 90011 22334",
    },
    status:"approved",
    walletBalance: 11200.25,
  },
  {
    sno: 5,
    details: {
      name: "Karan Patel",
      phone: "+91 90909 11122",
    },
    status:"rejected",
    walletBalance: 9800.0,
  },
];



export const engineerData: EngineerPage[] = [
  {
    sno: 1,
    details: {
      name: "Arjun Mehta",
      phone: "+91 98765 43210",
    },
    walletBalance: 12500.75,
  },
  {
    sno: 2,
    details: {
      name: "Priya Sharma",
      phone: "+91 99887 65432",
    },
    walletBalance: 8450.0,
  },
  {
    sno: 3,
    details: {
      name: "Rohit Verma",
      phone: "+91 91234 56789",
    },
    walletBalance: 15780.5,
  },
  {
    sno: 4,
    details: {
      name: "Sneha Iyer",
      phone: "+91 90011 22334",
    },
    walletBalance: 11200.25,
  },
  {
    sno: 5,
    details: {
      name: "Karan Patel",
      phone: "+91 90909 11122",
    },
    walletBalance: 9800.0,
  },
];


export const options = [
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];