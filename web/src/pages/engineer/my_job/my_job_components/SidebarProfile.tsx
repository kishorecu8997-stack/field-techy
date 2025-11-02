import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { EarningsData, SidebarProfileProps, UserProfile } from "../types";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { Button } from "@/shared/components/commonUI/Buttons";

/**
 * Sidebar component displaying the user's profile summary and earnings overview.
 *
 * Composed of two main sections:
 * - **ProfileCard**: Shows user name, contact info, role, and profile completion status.
 * - **EarningsCard**: Displays current balance and quick actions for financial management.
 * @example
 * <SidebarProfile user={user} earnings={earnings} />
 */
const SidebarProfile: React.FC<SidebarProfileProps> = ({ user, earnings }) => {
  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      <EarningsCard earnings={earnings} />
    </div>
  );
};

export default SidebarProfile;

/**
 * Displays a visually styled user profile card with avatar placeholder, contact info,
 * role, and a profile completion progress bar.
 *
 * Includes a "Complete Profile" call-to-action button (currently static).
 */
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

/**
 * Renders a financial summary card showing the user's current balance and quick-action buttons
 * for managing payouts (e.g., "Bank Details", "Withdraw").
 *
 * Includes a "View all" link (currently placeholder) for navigating to a full earnings page.
 */
const EarningsCard = ({ earnings }: { earnings: EarningsData }) => {
  const { balance } = earnings;
  const { setActiveKey, setISOpenSidebar } = useDrawerStore();

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
        <Button
          className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition"
          onClick={() => {
            setActiveKey("manageBankAccounts");
            setISOpenSidebar(true);
          }}
        >
          Bank Details
        </Button>
        <Button
          className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition"
          onClick={() => {
            setActiveKey("withdraw");
            setISOpenSidebar(true);
          }}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};
