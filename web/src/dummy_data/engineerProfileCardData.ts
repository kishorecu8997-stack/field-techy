import type { ProfileCardProps } from "@/pages/client/explore_engineer/types";


const dummyProfiles: ProfileCardProps['profile'][] = [
  {
    name: "Ablert Brown",
    rating: 4.5,
    reviewCount: 36,
    jobTitle: "Python Developer",
    location: "Dubai, UAE",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",    
  }
];
export default dummyProfiles;

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "cat-001", name: "Figma" },
  { id: "cat-002", name: "Animations" },
  { id: "cat-003", name: "Graphic art" },
  { id: "cat-004", name: "UI/UX" },
  { id: "cat-005", name: "Web Development" },
  { id: "cat-006", name: "Mobile Apps" },
  { id: "cat-007", name: "Illustration" },
  { id: "cat-008", name: "Photography" }
];