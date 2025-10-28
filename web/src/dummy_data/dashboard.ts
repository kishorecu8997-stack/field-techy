import type { JobOverview, ServiceCategory, InProgressJob } from "@/pages/client/dashboard/type";

// Dummy data

export const jobOverviewData: JobOverview[] = [
    {
      id: 1,
      title: "Active Jobs",
      count: 12,      
      color: "bg-teal-800 dark:bg-teal-900/40",
      textColor: "text-white dark:text-gray-900",
      buttonColor: "bg-blue-200 dark:bg-blue-800/60",
      buttonShow:true
    },
    {
      id: 2,
      title: "Completed Jobs",
      count: 5,
      color: "bg-green-100 dark:bg-green-900/40",
      textColor: "text-green-800 dark:text-green-300",
      buttonColor: "bg-green-200 dark:bg-green-800/60",
    },
    {
      id: 3,
      title: "Jobs Cancelled",
      count: 2,
      color: "bg-slate-200 dark:bg-slate-900/40",
      textColor: "text-slate-800 dark:text-slate-300",
      buttonColor: "bg-slate-300 dark:bg-slate-800/60"
    }
  ];
  
  export const serviceCategoriesData: ServiceCategory[] = [
    {
      id: 1,
      name: "Networks",
      engineers: "20+ Engineers",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Support",
      engineers: "50+ Engineers",
      image: "https://images.unsplash.com/photo-1581091580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Cloud",
      engineers: "26+ Engineers",
      image: "https://images.unsplash.com/photo-1581091580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Networks",
      engineers: "20+ Engineers",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Support",
      engineers: "50+ Engineers",
      image: "https://images.unsplash.com/photo-1581091580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];
  
  export const inProgressJobsData: InProgressJob[]  = [
    {
      id: 1,
      title: "Network Engineer",
      date: "20 Jan, 2025, 06:32 PM",
      location: "Dubai Marina, UAE",
      duration: "3 Days",
      serviceType: "Infrastructure Setup",
      price: "$5000",
      engineers: "4+",
      engineerAvatars: [
        "https://randomuser.me/api/portraits/women/65.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/75.jpg"
      ],
      WorkLocationType: "on-site",
      status: "inprogress"
    },
    {
      id: 2,
      title: "Network Engineer",
      date: "20 Jan, 2025, 06:32 PM",
      location: "Dubai Marina, UAE",
      duration: "3 Days",
      serviceType: "Infrastructure Setup",
      price: "$5000",
      engineers: "4+",
      engineerAvatars: [
        "https://randomuser.me/api/portraits/women/65.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/75.jpg"
      ],
      WorkLocationType: "on-site",
      status: "completed"
    },
    {
      id: 3,
      title: "Network Engineer",
      date: "20 Jan, 2025, 06:32 PM",
      location: "Dubai Marina, UAE",
      duration: "3 Days",
      serviceType: "Infrastructure Setup",
      price: "$5000",
      engineers: "4+",
      engineerAvatars: [
        "https://randomuser.me/api/portraits/women/65.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/75.jpg"
      ],
      WorkLocationType: "on-site",
      status: "completed"
    },
    {
      id: 4,
      title: "Network Engineer",
      date: "20 Jan, 2025, 06:32 PM",
      location: "Dubai Marina, UAE",
      duration: "3 Days",
      serviceType: "Infrastructure Setup",
      price: "$5000",
      engineers: "4+",
      engineerAvatars: [
        "https://randomuser.me/api/portraits/women/65.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/75.jpg"
      ],
      WorkLocationType: "remote",
      status: "inprogress"
    }

  ];