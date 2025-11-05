export interface Engineer {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  title: string;
  imageUrl: string;
}

export const mockEngineers: Engineer[] = [
  {
    id: 1,
    name: "Ablert Brown",
    rating: 4.5,
    reviewCount: 36,
    title: "Python Developer",
    imageUrl: "https://picsum.photos/seed/dev101/200/200",
  },
  {
    id: 2,
    name: "Sophia Turner",
    rating: 4.8,
    reviewCount: 42,
    title: "Full Stack Engineer",
    imageUrl: "https://picsum.photos/seed/dev102/200/200",
  },
  {
    id: 3,
    name: "Liam Patel",
    rating: 4.2,
    reviewCount: 28,
    title: "Backend Specialist",
    imageUrl: "https://picsum.photos/seed/dev103/200/200",
  },
  {
    id: 4,
    name: "Emma Zhang",
    rating: 4.9,
    reviewCount: 51,
    title: "Machine Learning Engineer",
    imageUrl: "https://picsum.photos/seed/dev104/200/200",
  },
  {
    id: 5,
    name: "Noah Kim",
    rating: 4.3,
    reviewCount: 33,
    title: "DevOps Engineer",
    imageUrl: "https://picsum.photos/seed/dev105/200/200",
  },
  {
    id: 6,
    name: "Olivia Davis",
    rating: 4.6,
    reviewCount: 39,
    title: "Frontend Developer",
    imageUrl: "https://picsum.photos/seed/dev106/200/200",
  },
  {
    id: 7,
    name: "Ethan Garcia",
    rating: 4.4,
    reviewCount: 30,
    title: "Cloud Architect",
    imageUrl: "https://picsum.photos/seed/dev107/200/200",
  },
  {
    id: 8,
    name: "Isabella Nguyen",
    rating: 4.7,
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
  {
    id: 9,
    name: "Isabella Nguyen",
    rating: 4.7,
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
  {
    id: 10,
    name: "Isabella Nguyen",
    rating: 4.7,
    reviewCount: 45,
    title: "Data Scientist",
    imageUrl: "https://picsum.photos/seed/dev108/200/200",
  },
];
