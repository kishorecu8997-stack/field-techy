import React from "react";
import { ChevronRight } from "lucide-react";
import { type ProfileMenuItemProps } from "./types";

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-3 px-4 hover:bg-gray-100 rounded-xl transition-colors duration-150"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-600">{icon}</span>
        <span className="text-gray-800 text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500" />
    </button>
  );
};

export default ProfileMenuItem;
