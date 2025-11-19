import { assetsConfig } from "@/assets";
import React from "react";
import { Link } from "react-router-dom";

const ProposalListCard: React.FC<{
  engineer: EngineerCardListProps;
  navigateToJob?: string;
}> = ({ engineer, navigateToJob = "#" }) => {
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
              {engineer.rating} ({engineer.reviewCount} reviews)
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
