import React from "react";

interface ProfileImageWithProgressProps {
  imageUrl: string;
  completionPercent: number;
}

/**
 * ProfileImageWithProgress Component
 *
 * Displays a circular profile image overlaid with a black progress ring and centered percentage text.
 * The progress ring visually represents a completion percentage (e.g., profile completeness).
 *
 * Features:
 * - Accepts a real image URL; falls back to a placeholder avatar on load error
 * - Renders a smooth SVG-based circular progress indicator
 * - Shows the completion percentage (0–100%) centered over the image
 * - Fully responsive (fixed 96×96 size) and accessible (alt text included)
 * - Supports dark mode (percentage text turns white in dark theme)
 *
 * @component
 * @example
 * <ProfileImageWithProgress
 *   imageUrl="https://example.com/profile.jpg"
 *   completionPercent={60}
 * />
 *
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - URL of the profile image
 * @param {number} props.completionPercent - Completion percentage (0 to 100)
 *
 * @returns {JSX.Element} A circular profile image with overlay progress ring and percentage text.
 */

const ProfileImageWithProgress: React.FC<ProfileImageWithProgressProps> = ({
  imageUrl,
  completionPercent,
}) => {
  // Calculate stroke-dasharray for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (completionPercent / 100) * circumference;

  return (
    <div className="mb-4 relative w-24 h-24">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-2 border-gray-300"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/96?text=👤";
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          width="96"
          height="96"
          viewBox="0 0 100 100"
          className="transform -rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
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

      <span className="absolute inset-0 flex dark:text-white items-center justify-center text-xs font-bold text-black pointer-events-none">
        {completionPercent}%
      </span>
    </div>
  );
};

export default ProfileImageWithProgress;
