import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { EarningsData, SidebarProfileProps, UserProfile } from "../types";

const SidebarProfile: React.FC<SidebarProfileProps> = ({ user, earnings }) => {
  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      <EarningsCard earnings={earnings} />
    </div>
  );
};

export default SidebarProfile;

const ProfileCard = ({ user }: { user: UserProfile }) => {
  const { name, phone, role, profileCompletion } = user;
  return (
    <div className="bg-gradient-to-br from-teal-800 to-teal-900 text-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-teal-700/30 backdrop-blur-sm rounded-full flex items-center justify-center text-xl">
          <FaUser />
        </div>
        <div>
          <h3 className="font-bold text-white">{name}</h3>
          <p className="text-sm opacity-90">{phone}</p>
          <p className="text-xs opacity-80">{role}</p>
        </div>
      </div>
      <button className="w-full bg-white text-teal-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition">
        Complete Profile
      </button>
      <div className="mt-4">
        <div className="flex justify-between text-xs opacity-90 mb-1">
          <span>Profile Score</span>
          <span>{profileCompletion}%</span>
        </div>
        <div className="w-full bg-teal-950/50 rounded-full h-2">
          <div
            className="bg-teal-300 h-2 rounded-full"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const EarningsCard = ({ earnings }: { earnings: EarningsData }) => {
  const { balance } = earnings;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          My Earnings
        </h3>
        <Link
          to="#"
          className="text-sm text-teal-800 dark:text-teal-400 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="text-center mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Current Balance
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          $
          {balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition">
          Bank Details
        </button>
        <button className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition">
          Withdraw
        </button>
      </div>
    </div>
  );
};
