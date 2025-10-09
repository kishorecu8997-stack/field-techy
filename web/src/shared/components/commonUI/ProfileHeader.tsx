import React from "react";
import { type UserProfile } from "../../../pages/engineer/components/ProfileSidebar/types";
import { Pencil } from "lucide-react";
import { assetsConfig } from "@/assets";

interface ProfileHeaderProps {
  user: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="relative w-24 h-24">
        <img
          src={assetsConfig.images.profile.defaultProfileImage}
          alt={user.name}
          className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
        />
        <button
          className="absolute bottom-1 right-1 bg-green-600 p-1.5 rounded-full shadow text-white hover:bg-green-700"
          aria-label="Edit Profile Picture"
        >
          <Pencil size={14} />
        </button>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full shadow">
          {user.completion}%
        </div>
      </div>

      <h2 className="mt-7 text-lg font-semibold text-gray-900">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.role}</p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium">{user.rating}</span> Ratings |{" "}
        <span className="font-medium">{user.reviews}</span> Reviews
      </p>
    </div>
  );
};

export default ProfileHeader;
