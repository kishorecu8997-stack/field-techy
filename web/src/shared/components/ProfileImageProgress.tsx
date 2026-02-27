import React from "react";

interface ProfileImageWithProgressProps {
  /** URL of the profile image */
  imageUrl: string;

  /** Completion percentage (0–100) */
  completionPercent: number;
}

/**
 * ProfileImageWithProgress Component
 *
 * Displays a circular profile image with an SVG progress ring
 * indicating completion percentage. The percentage value is shown
 * below the image instead of overlaying it.
 *
 * Features:
 * - Circular profile image with fallback placeholder on load error
 * - SVG-based animated progress ring
 * - Percentage text displayed below the image
 * - Smooth progress animation
 * - Responsive fixed size (96×96)
 * - Dark mode support for percentage text
 *
 * @component
 *
 * @example
 * ```tsx
 * <ProfileImageWithProgress
 *   imageUrl="https://example.com/profile.jpg"
 *   completionPercent={60}
 * />
 * ```
 *
 * @param {ProfileImageWithProgressProps} props - Component props
 * @param {string} props.imageUrl - Profile image URL
 * @param {number} props.completionPercent - Profile completion percentage (0–100)
 *
 * @returns {JSX.Element} Profile image with circular progress indicator and percentage label below.
 */

const ProfileImageWithProgress: React.FC<ProfileImageWithProgressProps> = ({
  imageUrl,
  completionPercent,
}) => {
  // Circle calculations for SVG progress ring
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (completionPercent / 100) * circumference;

  return (
    <div className="mb-4 flex flex-col">
      {/* Image + Progress Ring */}
      <div className="relative w-24 h-24">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/96?text=👤";
          }}
        />

        {/* Progress Ring Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg
            width="96"
            height="96"
            viewBox="0 0 100 100"
            className="transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />

            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#000"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
        </div>
      </div>

      {/* Percentage Label */}
      <span className="mt-2 w-24 text-center text-xs font-bold text-black dark:text-white">
        {completionPercent}%
      </span>
    </div>
  );
};

export default ProfileImageWithProgress;
