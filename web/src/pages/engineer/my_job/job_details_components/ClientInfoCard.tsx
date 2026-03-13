import React from "react";
import type { ClientInfoCardProps } from "../types";
// import { icons } from "@/config/icons";
import { Button } from "@/shared/components/commonUI/Buttons";
import { IoClose } from "react-icons/io5";
import { formatRating } from "@/utils/helpers";

/**
 * ClientInfoCard
 *
 * Displays a client's profile information, including name, membership date,
 * location, rating, reviews, and verifications. Provides a button to open
 * a review modal or form.
 *
 * @param {ClientInfoCardProps} props - Component props
 * @returns {JSX.Element} The client info card UI component
 */
const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  name,
  memberSince,
  // location,
  rating,
  reviews,
  verifications,
  onOpenReview,
  onClose,
  // phoneNumber,
  // email,
}) => {
  const formattedRating = formatRating(rating);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          About the Client
        </h2>
        {onClose && (
          <div
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-800 dark:text-teal-400 text-xl">
          🏢
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white">{name}</div>
          {memberSince && memberSince !== "-" && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Member since {memberSince}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 space-y-2">
        {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <icons.locationDot className="h-4 w-4" />
          <span>{location}</span>
        </div> */}

        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <span>⭐ {formattedRating}</span>
          <span className="text-gray-400">|</span>
          <span>{reviews} Reviews</span>
        </div>

        {/* 
        {phoneNumber && (
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <icons.phone className="h-4 w-4" />
            <span>{phoneNumber}</span>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <icons.mail className="h-4 w-4" />
            <span className="truncate">{email}</span>
          </div>
        )} */}
      </div>
      {verifications.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Client Verification
          </h3>
          <ul className="space-y-1.5 mb-5">
            {verifications.map((v, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <Button
            fullWidth
            variant="primary"
            onClick={onOpenReview}
            leftIcon={<span>⭐</span>}
          >
            Rate this Client
          </Button>
        </>
      )}
    </div>
  );
};

export default ClientInfoCard;
