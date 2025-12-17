import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { FaLaptopCode, FaMapMarkerAlt, FaHandHoldingUsd } from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { LuUsersRound } from "react-icons/lu";
import { TbNotes } from "react-icons/tb";

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
