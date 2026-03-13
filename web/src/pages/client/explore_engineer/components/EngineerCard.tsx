import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { EngineerCardProps } from "../types";
import { assetsConfig } from "@/assets";

/**
 * `EngineerCard` is a component that displays a summary of an engineer's profile.
 * It shows their name, rating, review count, title, and profile picture.
 * It includes a button to invite the engineer to a job.
 * The component supports both light and dark themes.
 * @param {EngineerCardProps} props The properties for the component.
 * @param {object} props.engineer An object containing the engineer's details.
 */
const EngineerCard: React.FC<EngineerCardProps> = ({ engineer }) => {
  const navigate = useNavigate();
  const detailsUrl = `${absoluteUrls.client.home.client_Explore_engineers_details}/${engineer.id}`;

  return (
    <div
      className="p-4 rounded-lg flex items-center gap-4 bg-slate-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300 cursor-pointer"
      onClick={() => navigate(detailsUrl)}
    >
      <img
        src={engineer.imageUrl || assetsConfig.images.users.user}
        alt={engineer.name}
        className="w-25 h-full rounded-full object-cover"
      />
      <div className="flex-1 min-w-0 ">
        <h3 className="font-bold text-lg truncate">{engineer.name}</h3>
        <div className="flex items-center gap-1 text-sm mb-1 dark:text-gray-300">
          <span className="text-yellow-500">★</span>
          <span className="truncate dark:text-gray-300">
            {engineer.rating} ({engineer.reviewCount} reviews)
          </span>
        </div>
        <p className="text-sm truncate dark:text-gray-300">{engineer.title}</p>
        <p className="text-sm truncate dark:text-gray-300">
          <span className="text-gray-500 dark:text-gray-300">Pay Type:</span>{" "}
          {engineer.pay_type}
        </p>
        <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <NavLink
            to={detailsUrl}
            className="hover:text-teal-900 text-[1rem] whitespace-nowrap"
          >
            <Button
              variant="primary"
              className="bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 dark:hover:bg-emerald-800 transition-colors text-white"
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
