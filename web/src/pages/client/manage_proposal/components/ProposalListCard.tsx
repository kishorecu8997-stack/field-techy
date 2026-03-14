import { assetsConfig } from "@/assets";
import React from "react";
import { Link } from "react-router-dom";
import type { EngineerCardListProps } from "../types";
import { formatRating } from "@/utils/helpers";

/**
 * `ProposalListCard` is a React component that displays a summary of an engineer's proposal.
 * It includes the engineer's name, rating, bid amount, pay type, and availability.
 * The card is a link that can navigate to a specific job page.
 *
 * @param {object} props - The props for the component.
 * @param {EngineerCardListProps} props.engineer - An object containing the engineer's proposal details.
 * @param {string} [props.navigateToJob='#'] - The URL to navigate to when the card is clicked. Defaults to '#'.
 * @returns {React.ReactElement} The rendered proposal list card component.
 */

const ProposalListCard: React.FC<{
  engineer: EngineerCardListProps;
  navigateToJob?: string;
}> = ({ engineer, navigateToJob = "#" }) => {
  const formattedRating = formatRating(engineer.rating);
  return (
    <Link
      to={navigateToJob}
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm sm:p-6 mb-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4 rounded-lg flex items-center gap-4 bg-teal-50 dark:bg-teal-800 text-gray-800 dark:text-white transition-colors duration-300 cursor-pointer">
        <img
          // src={engineer.imageUrl}
          src={assetsConfig.images.users.user}
          alt={engineer.name}
          className="w-30 h-30 rounded"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg">{engineer.name}</h3>
          <div className="flex items-center gap-1 text-sm mb-1">
            <span className="text-yellow-500">★</span>
            <span>
              {formattedRating} ({engineer.reviewCount} reviews)
            </span>
          </div>
          <div>
            <span className="font-bold text-xs">Bid Amount:</span>
            <span className=" text-xs">{engineer.bidAmount}</span>
          </div>
          <div>
            <span className="font-bold text-xs">Pay Type:</span>
            <span className="text-xs">{engineer.payType}</span>
          </div>
          <div>
            <span className="font-bold text-xs">Availability:</span>
            <span className="text-xs">{engineer.availability}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProposalListCard;
