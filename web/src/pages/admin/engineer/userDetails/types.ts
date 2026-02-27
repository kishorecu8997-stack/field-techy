export interface ClientReviewProps {
  id: number;
  reviewerName: string;
  reviewerPhoneNumber: string;
  reviewerEmail: string;
  profileUrl: string;
  jobTitle: string;
  rating: number;
  review: string;
  type: string; // e.g., "client"
  createdAt: string; // ISO date string
}
