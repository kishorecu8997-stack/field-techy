import React from "react";
import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { NavLink } from "react-router-dom";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { EngineerInviteCardProps } from "../../types";

const EngineerInviteCard: React.FC<EngineerInviteCardProps> = ({
  engineer,  
  onInviteToggle,
}) => {
  const { name, rating, reviewCount, title } = engineer;
  return (
    <div className="p-4 rounded-lg flex items-center gap-4 bg-slate-100 dark:bg-teal-800 text-gray-800 dark:text-white transition-colors duration-300 cursor-pointer">
      <img
        // src={engineer.imageUrl}
        src={assetsConfig.images.users.user}
        alt={name}
        className="w-25 h-full rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg">{name}</h3>
        <div className="flex items-center gap-1 text-sm mb-1">
          <span className="text-yellow-500">★</span>
          <span>
            {rating} ({reviewCount} reviews)
          </span>
        </div>
        <p className="text-sm font-medium">{title}</p>
        <div className="mt-2">
          <Button
            variant="primary"
            className="bg-teal-800 dark:bg-teal text-white"
            onClick={onInviteToggle}
          >
            Invite to Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EngineerInviteCard;
