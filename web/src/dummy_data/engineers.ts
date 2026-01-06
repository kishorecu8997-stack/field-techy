import { LuHandshake } from "react-icons/lu";
import { MdBarChart, MdOutlineDone } from "react-icons/md";
import { PiLightbulbFilamentFill } from "react-icons/pi";
import { TfiLocationArrow } from "react-icons/tfi";

export interface Engineer {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  title: string;
  imageUrl: string;
  pay_type?: string;
  availability?: string;
}

export const mockEngineers: Engineer[] = [
  {
    id: 1,
    name: "Ablert Brown",
    rating: 4.5,
    reviewCount: 36,
    pay_type: "Fixed",
    availability: "Immediate",
    title: "Python Developer",
    imageUrl: "https://picsum.photos/seed/dev101/200/200",
  },
  {
    id: 2,
    name: "Sophia Turner",
    rating: 4.8,
    reviewCount: 42,
    pay_type: "Fixed",
    availability: "Immediate",
    title: "Full Stack Engineer",
    imageUrl: "https://picsum.photos/seed/dev102/200/200",
  },
  {
    id: 3,
    name: "Liam Patel",
    rating: 4.2,
    reviewCount: 28,
    pay_type: "Fixed",
    availability: "Immediate",
    title: "Backend Specialist",
    imageUrl: "https://picsum.photos/seed/dev103/200/200",
  },
  {
    id: 4,
    name: "Emma Zhang",
    rating: 4.9,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 51,
    title: "Machine Learning Engineer",
    imageUrl: "https://picsum.photos/seed/dev104/200/200",
  },
  {
    id: 5,
    name: "Noah Kim",
    rating: 4.3,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 33,
    title: "DevOps Engineer",
    imageUrl: "https://picsum.photos/seed/dev105/200/200",
  },
  {
    id: 6,
    name: "Olivia Davis",
    rating: 4.6,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 39,
    title: "Frontend Developer",
    imageUrl: "https://picsum.photos/seed/dev106/200/200",
  },
  {
    id: 7,
    name: "Ethan Garcia",
    rating: 4.4,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 30,
    title: "Cloud Architect",
    imageUrl: "https://picsum.photos/seed/dev107/200/200",
  },
  {
    id: 8,
    name: "Isabella Nguyen",
    rating: 4.7,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
  {
    id: 9,
    name: "Isabella Nguyen",
    rating: 4.7,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
  {
    id: 10,
    name: "Isabella Nguyen",
    rating: 4.7,
    pay_type: "Fixed",
    availability: "Immediate",
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
];

interface EngineerCardListProps {
  id: number;
  name: string;
  rating: number;
  bidAmount: string;
  payType: string;
  reviewCount: number;
  title: string;
  availability: string;
  imageUrl: string;
  status: string;
}

export const engineerCardList: EngineerCardListProps[] = [
  {
    id: 1,
    name: "Alex Johnson",
    rating: 4.8,
    bidAmount: " AED 4500",
    payType: "Hourly",
    reviewCount: 127,
    title: "Full-Stack Developer",
    availability: "Immediate",
    imageUrl: "https://example.com/profiles/alex-johnson.jpg",
    status: "new",
  },
  {
    id: 2,
    name: "Priya Mehta",
    rating: 4.9,
    bidAmount: " AED 5000",
    payType: "Fixed",
    reviewCount: 89,
    title: "UI/UX Designer",
    availability: "Immediate",
    imageUrl: "https://example.com/profiles/priya-mehta.jpg",
    status: "new",
  },
  {
    id: 3,
    name: "James Wilson",
    rating: 4.6,
    bidAmount: " AED 4500",
    payType: "Hourly",
    reviewCount: 203,
    title: "DevOps Engineer",
    availability: "Immediate",
    imageUrl: "https://example.com/profiles/james-wilson.jpg",
    status: "applied",
  },
  {
    id: 5,
    name: "John Wilson",
    rating: 4.6,
    bidAmount: " AED 4500",
    payType: "Hourly",
    reviewCount: 203,
    title: "DevOps Engineer",
    availability: "Immediate",
    imageUrl: "https://example.com/profiles/james-wilson.jpg",
    status: "completed",
  },
  {
    id: 6,
    name: "James Wilson Sam",
    rating: 4.6,
    bidAmount: " AED 6500",
    payType: "Hourly",
    reviewCount: 203,
    title: "DevOps Engineer",
    availability: "Immediate",
    imageUrl: "https://example.com/profiles/james-wilson.jpg",
    status: "inprogress",
  },
];
