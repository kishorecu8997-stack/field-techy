import React from "react";
import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaRegCircle } from "react-icons/fa";
import type { EngineerInviteCardProps } from "../../types";

const EngineerInviteCard: React.FC<EngineerInviteCardProps> = ({
  engineer,
  onSelectionToggle,
  onInviteClick,
  selected = false,
}) => {
  const { id, name, rating, reviewCount, title } = engineer;

  return (
    <div className="p-4 rounded-lg flex items-start gap-4 bg-slate-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300 cursor-pointer hover:shadow-md">
      {/* Profile Image */}
      <img
        src={assetsConfig.images.users.user}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      {/* Engineer Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg truncate">{name}</h3>
        <div className="flex items-center gap-1 text-sm mb-1">
          <span className="text-yellow-500">★</span>
          <span>
            {rating} ({reviewCount} reviews)
          </span>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {title}
        </p>

        <div className="mt-2">
          <Button
            variant="primary"
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={(e) => {
                e.stopPropagation();
                onInviteClick && onInviteClick(id);
              }}
          >
            Invite to Job
          </Button>
        </div>
      </div>

      {/* Checkbox on the Right */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectionToggle(id);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onSelectionToggle(id);
          }
        }}
        aria-label={selected ? "Selected" : "Not selected"}
        className="w-5 h-5 flex items-center justify-center cursor-pointer"
      >
        {selected ? (
          <AiOutlineCheckCircle className="w-full h-full text-teal-800" />
        ) : (
          <FaRegCircle className="w-full h-full text-gray-400 dark:text-gray-300" />
        )}
      </div>
    </div>
  );
};

export default EngineerInviteCard;