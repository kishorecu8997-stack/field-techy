import React from "react";
import ProfileHeader from "../../../../shared/components/commonUI/ProfileHeader";
import ProfileMenuItem from "./ProfileMenuItem";
import { type UserProfile } from "./types";
import {
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const ProfileSidebar: React.FC = () => {
  const user: UserProfile = {
    name: "Nick Wilson",
    role: "Software Engineer",
    rating: 4.2,
    reviews: 23,
    completion: 50,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden md:w-96 mx-auto">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
        <button aria-label="Close">
          <X className="text-gray-500 hover:text-gray-700 w-5 h-5" />
        </button>
      </div>

      <ProfileHeader user={user} />

      <div className="flex flex-col px-4 pb-6 mt-4 space-y-1">
        <ProfileMenuItem label="Personal Information" icon={<User size={18} />} />
        <ProfileMenuItem label="Education" icon={<GraduationCap size={18} />} />
        <ProfileMenuItem label="Skills & Tool" icon={<Wrench size={18} />} />
        <ProfileMenuItem label="Experiences" icon={<Briefcase size={18} />} />
        <ProfileMenuItem label="Work Preference" icon={<ClipboardList size={18} />} />
        <ProfileMenuItem label="Documents" icon={<FileText size={18} />} />
        <ProfileMenuItem label="Settings" icon={<Settings size={18} />} />
        <ProfileMenuItem label="Logout" icon={<LogOut size={18} />} />
      </div>
    </div>
  );
};

export default ProfileSidebar;
