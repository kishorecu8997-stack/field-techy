import type { JSX } from "react";

export interface ProfileMenuItemProps {
  label: string;
  icon: JSX.Element;
  onClick?: () => void;
}

export interface UserProfile {
  name: string;
  role: string;
  rating: number;
  reviews: number;
  completion: number;
  avatarUrl: string;
}
