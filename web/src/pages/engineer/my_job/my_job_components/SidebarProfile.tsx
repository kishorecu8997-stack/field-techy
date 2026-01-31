import { icons } from "@/config/icons";
import { absoluteUrls } from "@/config/urls";
import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { useEngineerProfile } from "@/shared/store/useEngineerStore";
import { BOOKMARK_CHANGE_EVENT, getSavedJobs } from "@/utils/bookmarkUtils";
import { getCurrencyFromStorage } from "@/utils/currency";
import { getProfileCompletion } from "@/utils/profileCompletion";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { EarningsData, SidebarProfileProps } from "../types";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

/**
 * Sidebar component displaying the user's profile summary and earnings overview.
 *
 * Composed of three main sections:
 * - **ProfileCard**: Shows user name, contact info, role, and profile completion status.
 * - **EarningsCard**: Displays current balance and quick actions for financial management.
 * - **SavedJobsCard**: Shows the number of jobs the user has saved with a link to view all saved jobs.
 * @example
 * <SidebarProfile user={user} earnings={earnings} />
 */
const SidebarProfile: React.FC<SidebarProfileProps> = ({ earnings }) => {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <EarningsCard earnings={earnings} />
      <SavedJobsCard />
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
const ProfileCard = () => {
  const { profileData, setActiveKey, setISOpenSidebar, setNavigationSource } =
    useDrawerStore();
  // Get the overall profile completion percentage with the each field status
  const profileCompletion = getProfileCompletion(profileData);
  const engineerProfile = useEngineerProfile();

  return (
    <div
      id="completeProfile"
      className="bg-gradient-to-br from-teal-800 to-teal-900 text-white p-5 rounded-xl shadow-sm"
    >
      <div className="flex flex-row justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-700/30 backdrop-blur-sm rounded-full flex items-center justify-center text-xl">
            <FaUser />
          </div>
          <div>
            <h3 className="font-bold text-white">
              {engineerProfile?.fullName}
            </h3>
            <p className="text-sm opacity-90">{engineerProfile?.phoneNumber}</p>
            <p className="text-xs opacity-80">
              {engineerProfile?.serviceCategory}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setNavigationSource("profilecompletion", "profileCompletion");
            setActiveKey("profileCompletion");
            setISOpenSidebar(true);
          }}
          className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 h-fit"
        >
          Complete Now
        </button>
      </div>
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
  const [showBalance, setShowBalance] = useState<boolean>(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          My Earnings
        </h3>
        <div
          onClick={() => {
            setActiveKey("myEarning", false);
            setISOpenSidebar(true);
          }}
          className="text-sm text-teal-800 dark:text-teal-400 font-medium hover:underline cursor-pointer"
        >
          View all
        </div>
      </div>
      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Current Balance
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          <div className="flex justify-between items-center">
            {showBalance ? (
              <span>
                {getCurrencyFromStorage()}
                {balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            ) : (
              "******"
            )}

            {!showBalance ? (
              <BsEyeSlashFill
                className="cursor-pointer text-lg"
                onClick={() => setShowBalance(true)}
                role="button"
                aria-label="Show balance"
                tabIndex={0}
                onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowBalance((prev) => !prev);
                  }
                }}
              />
            ) : (
              <BsEyeFill
                className="cursor-pointer text-lg"
                onClick={() => setShowBalance(false)}
                role="button"
                aria-label="Hide balance"
                tabIndex={0}
                onKeyDown={(event: React.KeyboardEvent<SVGElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowBalance((prev) => !prev);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          id="myEarnings"
          className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition"
          onClick={() => {
            setActiveKey("manageBankAccounts", false);
            setISOpenSidebar(true);
          }}
        >
          Bank Details
        </Button>
        <Button
          id="withdrawMoney"
          className="bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-lg text-sm font-medium transition"
          onClick={() => {
            setActiveKey("withdraw", false);
            setISOpenSidebar(true);
          }}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

/**
 * Renders a summary card showing the user's saved jobs status.
 *
 * Displays:
 * - Total number of saved jobs (large central number)
 * - Breakdown of active (green) and expired (red) jobs based on start date
 * - "View all" link that navigates to the full Saved Jobs page
 *
 * Counts update in real-time when jobs are bookmarked or unbookmarked.
 */
const SavedJobsCard = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const savedJobs = getSavedJobs();
      const now = new Date();

      let activeCount = 0;
      let expiredCount = 0;

      savedJobs.forEach((job) => {
        if (!job.startDate) {
          console.warn("Missing startDate for job:", job.jobTitle);
          return;
        }

        const cleanDate = job.startDate.replace(",", "").trim();
        const startDate = new Date(cleanDate);

        if (isNaN(startDate.getTime())) {
          console.warn(
            "Invalid date format for job:",
            job.jobTitle,
            job.startDate,
          );
          return;
        }
        const nowUTC = Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
        );
        const startUTC = Date.UTC(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth(),
          startDate.getUTCDate(),
        );

        if (startUTC >= nowUTC) {
          activeCount++;
        } else {
          expiredCount++;
        }
      });

      setTotal(savedJobs.length);
      setActive(activeCount);
      setExpired(expiredCount);
    };

    updateCounts();

    window.addEventListener(BOOKMARK_CHANGE_EVENT, updateCounts);
    return () =>
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, updateCounts);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <icons.bookmarkFilled className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Saved Jobs
        </h3>
        <div
          onClick={() => navigate(absoluteUrls.engineer.home.saved_jobs)}
          className="text-sm text-teal-800 dark:text-teal-400 hover:underline font-medium cursor-pointer"
        >
          View all
        </div>
      </div>

      {/* Big Total */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {total}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total saved
        </div>
      </div>

      {/* Active vs Expired */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {active}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">
            Active
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {expired}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300 mt-1">
            Expired
          </div>
        </div>
      </div>
    </div>
  );
};
