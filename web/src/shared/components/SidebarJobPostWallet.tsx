import { absoluteUrls } from "@/config/urls";
import { Link, NavLink } from "react-router-dom";

interface EarningsData {
  balance: number;
}

interface SidebarProfileProps {
  earnings: EarningsData;
}

/**
 * Sidebar with two cards:
 * - "Looking for Talent?" CTA
 * - "My Wallet" with balance and actions
 */
const SidebarJobPostWallet: React.FC<SidebarProfileProps> = ({ earnings }) => {
  return (
    <div className="space-y-6">
      <TalentSeekerCard />
      <WalletCard earnings={earnings} />
    </div>
  );
};

export default SidebarJobPostWallet;

// ─── Talent Seeker Card ────────────────────────────────

const TalentSeekerCard = () => {
  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-700 text-white p-5 shadow-sm overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full border-2 border-white"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-white"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-lg font-bold mb-2">Looking for Talent?</h2>
        <p className="text-sm opacity-90 mb-4">
          Post your job opportunity and effortlessly engage with skilled professionals!
        </p>
         <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <NavLink
              to={absoluteUrls.client.home.post_JobPage}
              className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
            >
              <button
                className="bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-medium py-2 px-4 rounded-2xl text-sm transition-colors duration-200"
              >
                Post A Job
              </button>
            </NavLink>
          </nav>        
      </div>
    </div>
  );
};

// ─── Wallet Card ───────────────────────────────────────

const WalletCard = ({ earnings }: { earnings: EarningsData }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">My Wallet</h3>
        <Link
          to="#"
          className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="text-center mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Current Balance</p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          ${earnings.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200">
          Add Fund
        </button>
        <button className="bg-emerald-900 hover:bg-emerald-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200">
          Transactions
        </button>
      </div>
    </div>
  );
};