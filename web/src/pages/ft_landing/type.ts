import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaHandHoldingUsd,
  FaUser,
} from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { LuFileSpreadsheet, LuUsersRound } from "react-icons/lu";
import { TbNotes } from "react-icons/tb";
import { BsSuitcaseLg } from "react-icons/bs";
import { GoProject } from "react-icons/go";
import { MdAccessTimeFilled, MdOutlineWifiTethering } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineCash } from "react-icons/hi";
import { RiShoppingBag4Fill } from "react-icons/ri";

export const features = [
  {
    title: "92%",
    subtitle: "Faster Job Assignment",
    image: `${assetsConfig.landing.job_platform.job_assignment}`,
  },
  {
    title: "35%",
    subtitle: "Reduction in Delivery Time",
    image: `${assetsConfig.landing.job_platform.delivery_time}`,
  },
  {
    title: "100%",
    subtitle: "Real-Time Visibility",
    image: `${assetsConfig.landing.job_platform.real_time_visibility}`,
  },
];

export const experiences = [
  {
    title: "For Engineers",
    description:
      "Find jobs and manage your earnings. Clear job details, guided steps, easy updates, and faster completion.",
    image: `${assetsConfig.landing.job_platform.for_engineers}`,
    icon: `${assetsConfig.landing.icons.engineer}`,
    link: `${absoluteUrls.engineer.auth.login}`,
  },
  {
    title: "For Corporates",
    description:
      "Manage multi-site projects and teams. Allows creating long-term project jobs lasting up to 24 months.",
    image: `${assetsConfig.landing.job_platform.for_corporates}`,
    icon: `${assetsConfig.landing.icons.corporates}`,
    link: `${absoluteUrls.client.auth.login}`,
  },
  {
    title: "For Home & End Customers",
    description:
      "Book verified engineers for home tasks. Transparent service tracking, smooth communication, and digital reports.",
    image: `${assetsConfig.landing.job_platform.for_home_customers}`,
    icon: `${assetsConfig.landing.icons.home_customers}`,
    link: `${absoluteUrls.client.auth.login}`,
  },
];

export const steps = {
  corporate: [
    {
      step: "Step 1",
      title: "Post, Assign & Monitor Work Instantly",
      description:
        "Streamline your field service operations by dispatching jobs to the widest network of technicians. Manage creation, approval, and completion—all from a single platform.",
      icon: TbNotes,
    },
    {
      step: "Step 2",
      title: "Quickly Find and Deploy Expert Techs",
      description:
        "Easily evaluate and choose trusted service professionals by filtering for skills, location, and specific site or project requirements.",
      icon: LuUsersRound,
    },
    {
      step: "Step 3",
      title: "Flexible Workforce on Demand",
      description:
        "Scale your workforce up or down based on customer demand. Adjust with fluctuating workloads while maintaining quality—without increasing overhead.",
      icon: SlEnergy,
    },
  ],
  engineer: [
    {
      step: "Step 1",
      title: "Browse & Accept Jobs",
      description:
        "See available jobs near you, filter by skill, pay, and time. Accept jobs that match your schedule and expertise — all in one place.",
      icon: FaLaptopCode,
    },
    {
      step: "Step 2",
      title: "Get Real-Time Guidance",
      description:
        "Access job details, maps, client notes, and tools needed — all updated live. No more guesswork or missed info on-site.",
      icon: FaMapMarkerAlt,
    },
    {
      step: "Step 3",
      title: "Get Paid Fast & Track Earnings",
      description:
        "Complete jobs, submit proof, and get paid within days. Track your earnings, ratings, and performance — all transparent and automated.",
      icon: FaHandHoldingUsd,
    },
  ],
};

export const keyFeatures = [
  {
    id: 1,
    title: "Smart Scheduling and Dispatch",
    description:
      "Assign the right technician instantly with optimized routing and recommendations.",
    alwaysVisible: false,
    image: `${assetsConfig.landing.job_platform.smart_scheduling}`,
    icon: BsSuitcaseLg,
    items: [
      "Engineer assignment based on skill set",
      "Route optimization",
      "Priority-based dispatch",
      "Reduce manual coordination",
    ],
  },
  {
    id: 2,
    title: "Project & Service Insights",
    description:
      "Gain comprehensive visibility into your projects and services with real-time analytics.",
    image: `${assetsConfig.landing.job_platform.service_insights}`,
    icon: GoProject,
    items: [
      "Project progress & workload analytics",
      "Dedicated / Dispatch / Scheduled jobs",
      "Technician allocation & productivity",
      "SLA across projects & services",
    ],
  },
  {
    id: 3,
    title: "Live Technician Tracking",
    description:
      "Monitor technician locations in real-time with GPS tracking and route optimization.",
    image: `${assetsConfig.landing.job_platform.technician_tracking}`,
    icon: MdOutlineWifiTethering,
    items: [
      "Real-time map view",
      "Real-time ETAs",
      "Real-time status updates",
      "Delay alerts",
    ],
  },
  {
    id: 4,
    title: "Digital Job Sheets",
    description:
      "Complete job documentation digitally with customizable forms and photo capture.",
    image: `${assetsConfig.landing.job_platform.digital_job}`,
    icon: LuFileSpreadsheet,
    items: [
      "Guided task steps",
      "Photo uploads",
      "Digital signatures",
      "Report generation and surveys",
    ],
  },
  {
    id: 5,
    title: "Customer Notifications",
    description:
      "Keep customers informed with automated SMS, email, and push notifications.",
    image: `${assetsConfig.landing.job_platform.customer_notification}`,
    icon: IoNotificationsOutline,
    items: [
      "SMS/Email alerts",
      "Engineer arrival updates",
      "Job status messages",
      "Automated follow-ups",
    ],
  },
  {
    id: 6,
    title: "Rate Card Management",
    description:
      "Manage pricing structures, service rates, and billing rules with flexible configurations.",
    image: `${assetsConfig.landing.job_platform.ratecard_management}`,
    icon: HiOutlineCash,
    items: [
      "Fixed & customizable rate card models",
      "Location-based pricing",
      "Auto cost calculation",
      "Transparent billing",
    ],
  },
];

export const testimonials = [
  {
    id: 1,
    name: "KaiB",
    date: "22 Jul",
    verified: true,
    rating: 5,
    text: "Field Techy helps us manage both on-site and off-site services from one platform. Scheduling, tracking, and approvals are now smooth and fully transparent.",
    image: `${assetsConfig.images.users.user}`,
  },
  {
    id: 2,
    name: "Reena",
    date: "23 Jul",
    verified: true,
    rating: 5,
    text: "Whether it’s remote support or on-ground work, Field Techy keeps everything organised. Our team always knows what to do and when.",
    image: `${assetsConfig.images.profile.defaultProfileImage}`,
  },
  {
    id: 3,
    name: "John",
    date: "24 Jul",
    verified: true,
    rating: 5,
    text: "With Field Techy, we significantly reduced delays and improved overall service delivery for both physical on-site visits and off-site remote work. The visibility and real-time updates helped...",
    readMore: true,
    image: `${assetsConfig.images.profile.defaultProfileImage}`,
  },
  {
    id: 4,
    name: "Moren",
    date: "25 Jul",
    verified: true,
    rating: 4,
    text: "Complete service control, end to end.",
    image: `${assetsConfig.images.users.user}`,
  },
];

export const serviceOperationStats = [
  {
    icon: RiShoppingBag4Fill,
    title: "Technician Network",
    value: "Over 12,000+ technicians",
    subtitle: "successfully completed jobs using Field Techy",
  },
  {
    icon: FaUser,
    title: "Businesses Onboarded",
    value: "500+ service businesses",
    subtitle: "posted and managed work orders seamlessly",
  },
  {
    icon: MdAccessTimeFilled,
    title: "Faster Job Assignments",
    value: "70% job assign in 30 minutes",
    subtitle: "using smart matching & location-based dispatch",
  },
];

export const options = [
  {
    id: "corporate",
    title: "For Corporates",
    description: "Manage multi-site projects and teams.",
  },
  {
    id: "engineer",
    title: "For Engineers",
    description: "Find jobs and manage your earnings.",
  },
  {
    id: "home-client",
    title: "For Home Clients",
    description: "Book verified engineers for home tasks.",
  },
];

export interface UserTypeOption {
  id: string;
  title: string;
  description: string;
}
export interface UserTypeDropdownProps {
  title?: string;
  selected: string | null;
  onSelect: (value: string) => void;
  options: UserTypeOption[];
  className?: string;
  onClose?: () => void;
}

export type ServiceOperationFormData = {
  fullName: string;
  email: string;
  company: string;
  country: string;
  city: string;
  message: string;
};