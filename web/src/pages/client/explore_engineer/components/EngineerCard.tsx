import React from "react";
import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { NavLink } from "react-router-dom";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * `EngineerCard` is a component that displays a summary of an engineer's profile.
 * It shows their name, rating, review count, title, and profile picture.
 * It includes a button to invite the engineer to a job.
 * The component supports both light and dark themes.
 * @param {EngineerCardProps} props The properties for the component.
 * @param {object} props.engineer An object containing the engineer's details.
 */
const EngineerCard: React.FC<EngineerCardProps> = ({ engineer }) => {
  return (
    <div className="p-4 rounded-lg flex items-center gap-4 bg-slate-100 dark:bg-teal-800 text-gray-800 dark:text-white transition-colors duration-300 cursor-pointer">
      <img
        // src={engineer.imageUrl}
        src={assetsConfig.images.users.user}
        alt={engineer.name}
        className="w-25 h-full rounded-lg object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg">{engineer.name}</h3>
        <div className="flex items-center gap-1 text-sm mb-1">
          <span className="text-yellow-500">★</span>
          <span>
            {engineer.rating} ({engineer.reviewCount} reviews)
          </span>
        </div>
        <p className="text-sm font-medium">{engineer.title}</p>
        <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <NavLink
            to={absoluteUrls.client.home.explore_engineers_details}
            className="hover:text-teal-900 text-[1rem] whitespace-nowrap"
          >
            <Button
              variant="primary"    
              className="bg-teal-800 dark:bg-teal text-white"                        
            >
              Invite to Job
            </Button>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default EngineerCard;
