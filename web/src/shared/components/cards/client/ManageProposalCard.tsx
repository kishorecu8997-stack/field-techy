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
  attachmentUrl?: string | null;
  receivedOn?: string | null;
  onClick?: () => void;
}

/**
 * ManageProposalCard Component
 * A reusable card component for displaying details about a proposal.
 *
 * @param {ManageProposalCardProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered ManageProposalCard component.
 */
const ManageProposalCard: React.FC<ManageProposalCardProps> = ({
  name,
  rating,
  reviews,
  imageUrl,
  bidAmount,
  payType,
  availability,
  attachmentUrl,
  receivedOn,
  onClick,
}) => {
  // The card has an onClick handler but lacks keyboard accessibility.
  // When a div is clickable, it should either be a button element or include
  // role="button", tabIndex={0}, and keyboard event handlers (onKeyDown/onKeyPress)
  // for Enter and Space keys. This follows the accessibility pattern established in the codebase.
  return (
    <div
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 hover:shadow-md transition-shadow w-full max-w-xl"
      onClick={onClick}
      // Accessibility: make the div focusable and keyboard accessible
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
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
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-400">
          {name}
        </h2>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
          <span className="text-yellow-500 text-base">★</span>
          <span className="ml-1 font-medium">{rating}</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">
            ({reviews} reviews)
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Bid Amount:
          </span>{" "}
          {bidAmount}
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Pay Type:
          </span>{" "}
          {payType}
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Availability:
          </span>{" "}
          {availability}
        </p>

        {attachmentUrl && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Attachment:
            </span>{" "}
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              View PDF
            </a>
          </p>
        )}

        {receivedOn && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Received On:
            </span>{" "}
            {receivedOn}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageProposalCard;
