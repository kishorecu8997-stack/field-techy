import { assetsConfig } from "@/assets";
import { useEffect, useRef, useState } from "react";
import { BsTextLeft } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { notifications, type NavbarProps } from "./types";
import { absoluteUrls } from "@/config/urls";
import SelectMenu from "@/shared/components/Temp";
import { countries } from "@/dummy_data/adminDashboard";
import NotificationDropdown from "@/shared/components/NotitficationPopover";

/**
 * Header
 *
 * Top navigation component for the admin dashboard. Provides navigation controls,
 * region selection, notifications panel, and user profile access.
 *
 * Features:
 * - Sidebar toggle control
 * - Region selection dropdown
 * - Notifications panel with click-outside behavior
 * - User profile section with avatar and role display
 *
 * @param {NavbarProps} props - Component props
 * @param {Function} props.onToggleSidebar - Callback to toggle the sidebar visibility
 * @returns {JSX.Element} Header component with navigation controls and user interface
 */
export default function Header({ onToggleSidebar }: NavbarProps) {
  const [region, setRegion] = useState<string | null>();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isNotificationOpen &&
        !bellRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <header
      className="text-white px-4 sm:px-6 py-2 shadow-lg flex justify-between items-center"
      style={{
        background: "linear-gradient(to right, #034444, #014d45)",
      }}
    >
      <div className="flex items-center space-x-4">
        <Link to="/admin/dashboard" className="">
          <img
            src={assetsConfig.logos.ftLogoWhite}
            alt="FT Logo"
            className="w-auto"
          />
        </Link>
        <BsTextLeft
          onClick={onToggleSidebar}
          className="hidden sm:block text-xl cursor-pointer"
        />
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <SelectMenu
          placeholder="Select Region"
          className="w-36"
          options={countries}
          value={region}
          onChange={setRegion}
        />

        <div
          className="text-xl cursor-pointer"
          ref={bellRef}
          onClick={toggleNotifications}
        >
          <FaRegBell />
        </div>
      

        <Link to={absoluteUrls.admin.home.profile}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-800">K</span>
              {/* <img src="" /> */}
            </div>

            <div className="hidden sm:block">
              <div className="font-semibold text-md">Kevin Smith</div>
              <div className="text-xs text-gray-300">Admin</div>
            </div>
          </div>
        </Link>
        <BsTextLeft
          onClick={onToggleSidebar}
          className="block sm:hidden text-xl cursor-pointer"
        />
      </div>

      {isNotificationOpen && (
        <NotificationDropdown
          ref={dropdownRef}
          title="Recent Alerts"
          seeAllLink={`${absoluteUrls.admin.home.received_notification}`}
          onClose={() => setIsNotificationOpen(false)}
        >
          {notifications.map((n) => (
            <div className="flex items-start px-4 py-3 cursor-pointer">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0 mr-3"></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {n.name}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {n.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </NotificationDropdown>
      )}
    </header>
  );
}
