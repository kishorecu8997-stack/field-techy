import React from "react";
import { FaUserCircle } from "react-icons/fa";

export interface ManageProposalCardProps {
  name: string;
  rating: string;
  reviews: string;
  imageUrl?: string;
  bidAmount: string;
  payType: string;
  availability: string;
  onClick?: () => void;
}

const ManageProposalCard: React.FC<ManageProposalCardProps> = ({
  name,
  rating,
  reviews,
  imageUrl,
  bidAmount,
  payType,
  availability,
  onClick,
}) => {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-shadow w-full max-w-xl"
      onClick={onClick}
    >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-lg object-cover"
          />
        ) : (
          <div className="h-30 w-30 rounded-lg bg-gray-100 flex items-center justify-center">
            <FaUserCircle className="w-16 h-16 text-gray-400" />
          </div>
        )}
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-emerald-900">{name}</h2>

        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="text-yellow-500 text-base">★</span>
          <span className="ml-1 font-medium">{rating}</span>
          <span className="ml-1 text-gray-500">({reviews} reviews)</span>
        </div>

        <p className="text-sm text-gray-700 mt-2">
          <span className="font-semibold text-gray-900">Bid Amount:</span>{" "}
          {bidAmount}
        </p>

        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold text-gray-900">Pay Type:</span>{" "}
          {payType}
        </p>

        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold text-gray-900">Availability:</span>{" "}
          {availability}
        </p>
      </div>
    </div>
  );
};

export default ManageProposalCard;
