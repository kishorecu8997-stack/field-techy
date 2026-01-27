import React, { useEffect } from "react";
import { ImageUploaderField } from "./inputs/ImageUploaderField";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserId } from "@/utils";
import { useProfileFileUpload } from "@/shared/hooks/useProfileFileUpload";

/**
 * ProfileCard component displays a user profile with avatar, name, title, and rating information.
 * Features a progress indicator around the avatar and dark mode support.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.avatarUrl - URL of the user's avatar image
 * @param {string} props.name - User's full name
 * @param {string} props.title - User's job title or role
 * @param {number} props.rating - Average rating (e.g., 4.5)
 * @param {number} props.reviewCount - Total number of reviews
 * @param {number} props.completionPercentage - Profile completion percentage (0-100)
 *
 * @example
 * <ProfileCard
 *   avatarUrl="/path/to/avatar.jpg"
 *   name="John Doe"
 *   title="Senior Developer"
 *   rating={4.8}
 *   reviewCount={128}
 *   completionPercentage={85}
 * />
 */
const ProfileCard = ({
  avatarUrl,
  name,
  title,
  rating,
  reviewCount,
  flex = "row",
  backgroundcolor = true,
  isLoadingProfilePicture = false,
}: {
  avatarUrl: string;
  name: string;
  title: string;
  rating: number;
  reviewCount?: number;
  completionPercentage: number;
  flex?: "row" | "col";
  backgroundcolor?: boolean;
  isLoadingProfilePicture?: boolean;
  engineerId?: string;
}) => {
  const formContext = useFormContext();
  const watch = formContext?.watch;

  const userId = getUserId();
  const profileImage = watch ? watch("profileImage") : null;
  const { uploadProfileFile, isUploading } = useProfileFileUpload({
    onSuccess: () => toast.success("Profile picture updated successfully!"),
    onError: () => toast.error("Failed to update profile picture."),
  });

  useEffect(() => {
    if (userId && profileImage instanceof File) {
      uploadProfileFile(profileImage, "profilePicture");
    }
  }, [userId, profileImage]);

  return (
    <div
      className={`flex 
    ${flex === "row" ? "flex-row" : "flex-col"} 
    items-center 
    space-x-4 
    mb-6 
    p-4 
    ${backgroundcolor
          ? "bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl w-full dark:from-gray-800 dark:to-gray-900"
          : ""
        }`}
    >
      <div className="relative">
        <ImageUploaderField
          name="profileImage"
          initialImageUrl={avatarUrl}
          isLoading={isLoadingProfilePicture || isUploading}
        />
      </div>
      <div>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
          {name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {rating} Ratings | {reviewCount} Reviews
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;

/**
 * ProfileAvatarProgress component displays a circular user avatar
 * with a red circular progress indicator and a percentage badge.
 *
 * Designed to match: https://i.imgur.com/XYZ.png (your image)
 */

interface ProfileAvatarProgressProps {
  avatarUrl: string;
  completionPercentage: number;
  className?: string;
}

export const ProfileAvatarProgress: React.FC<ProfileAvatarProgressProps> = ({
  avatarUrl,
  completionPercentage,
  className = "",
}) => {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="h-20 w-20 rounded-full border-4 border-white object-cover"
        />
        <svg
          className="absolute top-0 left-0 transform -rotate-90"
          width="80"
          height="80"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#ef4444" // red-500
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white text-gray-800 px-2 py-1 rounded-full shadow-2xl text-sm font-medium">
        {completionPercentage}%
      </div>
    </div>
  );
};
