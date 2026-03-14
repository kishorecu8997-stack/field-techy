import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "../../commonUI/Buttons";
import { formatRating } from "@/utils/helpers";

export interface ExploreEngineerHeaderCardProps {
  name: string;
  rating: string;
  reviews: string;
  imageUrl?: string;
  bidAmount: string;
  payType: string;
  availability: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

/*
 * ExploreEngineerHeaderCard
 *    - Displays a card with details about an engineer
 * @param {ExploreEngineerHeaderCardProps} props - The props for the ExploreEngineerHeaderCard component.
 * @returns {JSX.Element} The rendered ExploreEngineerHeaderCard component.
 */
const ExploreEngineerHeaderCard: React.FC<ExploreEngineerHeaderCardProps> = ({
  name,
  rating,
  reviews,
  imageUrl,
  bidAmount,
  payType,
  availability,
  onAccept,
  onDecline,
}) => {
  const formattedRating = formatRating(rating);
  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 p-4 rounded-2xl bg-emerald-900 text-white w-full max-w-4xl  overflow-hidden">
      <div className="flex items-center gap-6 ">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-lg object-cover"
          />
        ) : (
          <div className="h-full w-30 rounded-lg bg-gray-100 flex items-center justify-center">
            <FaUserCircle className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-white">{name}</h2>

          <div className="flex items-center text-sm mt-1">
            <span className="text-yellow-400 text-base">★</span>
            <span className="ml-1 font-medium">{formattedRating}</span>
            <span className="ml-1 text-gray-300">({reviews} reviews)</span>
          </div>

          <p className="text-sm mt-2">
            <span className="font-semibold">Bid Amount:</span> {bidAmount}
          </p>

          <p className="text-sm mt-1">
            <span className="font-semibold">Pay Type:</span> {payType}
          </p>

          <p className="text-sm mt-1">
            <span className="font-semibold">Availability:</span> {availability}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4  self-end">
        <Button onClick={onAccept}>Accept & Assign</Button>

        <Button onClick={onDecline} variant="secondary">
          Decline
        </Button>
      </div>
    </div>
  );
};

export default ExploreEngineerHeaderCard;
