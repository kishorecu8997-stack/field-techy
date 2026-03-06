import type {
  JobOverview,
  InProgressJob,
} from "@/pages/client/dashboard/type";


// Dummy data

export const jobOverviewData: JobOverview[] = [
  {
    id: 1,
    title: "Active Jobs",
    count: 12,
    status: "inprogress",
    buttonShow: true,
  },
  {
    id: 2,
    title: "Completed Jobs",
    count: 5,
    status: "completed",
  },
  {
    id: 3,
    title: "Jobs Cancelled",
    count: 2,
    status: "cancelled",
  },
];


export const inProgressJobsData: InProgressJob[] = [
  {
    id: 1,
    title: "Network Engineer",
    date: "05 Jan, 2025, 06:32 PM",
    location: "Dubai Marina, UAE",
    duration: "3 Days",
    serviceType: "Infrastructure Setup",
    price: "$5000",
    engineers: "4+",
    engineerAvatars: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
    WorkLocationType: "on-site",
    status: "inprogress",
  },
  {
    id: 2,
    title: "Hardware Engineer",
    date: "10 Jan, 2025, 06:32 PM",
    location: "Chennai",
    duration: "3 Days",
    serviceType: "Infrastructure Setup",
    price: "$5000",
    engineers: "3+",
    engineerAvatars: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
    WorkLocationType: "on-site",
    status: "completed",
  },
  {
    id: 3,
    title: "Clould Engineer",
    date: "19 Jan, 2025, 06:32 PM",
    location: "Bangalore",
    duration: "3 Days",
    serviceType: "Infrastructure Setup",
    price: "$5000",
    engineers: "4+",
    engineerAvatars: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
    WorkLocationType: "on-site",
    status: "completed",
  },
  {
    id: 4,
    title: "Network Engineer",
    date: "25 Jan, 2025, 06:32 PM",
    location: "Dubai Marina, UAE",
    duration: "3 Days",
    serviceType: "Infrastructure Setup",
    price: "$5000",
    engineers: "5+",
    engineerAvatars: [
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
    WorkLocationType: "remote",
    status: "inprogress",
  },
];
