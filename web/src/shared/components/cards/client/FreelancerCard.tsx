import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "../../commonUI/Buttons";

export interface FreelancerCardProps {
  id: number;
  name: string;
  rating: string;
  reviews: number;
  role: string;
  imageUrl?: string;
  onInvite?: () => void;

  selected: boolean;
  onSelect: (id: number) => void;
}

/**
 * FreelancerCard Component
 * Renders a card for a freelancer, displaying the freelancer's name, rating, role, and availability.
 * @param {FreelancerCardProps} props - Configuration props including the freelancer object
 * @returns {JSX.Element} The rendered card element with a clickable image and name
 */
const FreelancerCard: React.FC<FreelancerCardProps> = ({
  id,
  name,
  rating,
  reviews,
  role,
  imageUrl,
  onInvite,
  selected,
  onSelect,
}) => {
  return (
    <div
      className="relative flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(id)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-20 h-20 rounded-lg object-cover"
        />
      ) : (
        <FaUserCircle className="w-16 h-16 text-gray-400" />
      )}

      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="text-yellow-500 text-base">★</span>
          <span className="ml-1 font-medium">{rating}</span>
          <span className="ml-1 text-gray-500">({reviews} reviews)</span>
        </div>

        <p className="text-sm text-gray-700 mt-1">{role}</p>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onInvite?.();
          }}
          className="mt-3 w-fit bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-900 transition-colors"
        >
          Invite to Job
        </Button>
      </div>

      {/* TOP RIGHT ICON */}
      <div
        className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border transition-colors ${
          selected
            ? "bg-emerald-800 border-emerald-800 text-white"
            : "border-gray-400 text-transparent"
        }`}
      >
        {selected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default FreelancerCard;
