import React from "react";

const ProfileCard = ({
  avatarUrl,
  name,
  title,
  rating,
  reviewCount,
  completionPercentage,
}: {
  avatarUrl: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  completionPercentage: number;
}) => {
  return (
    <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
      <div className="relative">
        <ProfileAvatarProgress
          avatarUrl={avatarUrl}
          completionPercentage={completionPercentage}
        />
      </div>
      <div>
        <h2 className="font-bold text-lg text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xs text-gray-500">
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
