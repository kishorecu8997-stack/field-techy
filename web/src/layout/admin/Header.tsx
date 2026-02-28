import { assetsConfig } from "@/assets";
import { useEffect, useRef, useState } from "react";
import { BsTextLeft } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { notifications, type NavbarProps } from "./types";
import { absoluteUrls } from "@/config/urls";
import NotificationDropdown from "@/shared/components/NotitficationPopover";
import SelectMenu from "@/shared/components/SelectMenu";
import {
  LookupTable,
  useAppGetLookupData,
} from "@/shared/apiServices/admin/adminOpenApiService";
import { useAdminProfile } from "@/shared/store/useAdminProfileStore";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";

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
  const { regionId, setRegion } = useAdminCountryStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const adminProfile = useAdminProfile();
  const { data: adminLookupData } = useAppGetLookupData(LookupTable.Countries);

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

  const handleRegionChange = (id: string | null) => {
    const selectedRegion = adminLookupData?.find(
      (item) => item.id.toString() === id,
    );
    setRegion(id, selectedRegion?.name ?? null);
  };

  // Auto-select first region when data loads and none is selected yet
  useEffect(() => {
    if (adminLookupData && adminLookupData.length > 0 && !regionId) {
      const first = adminLookupData[0];
      setRegion(first.id.toString(), first.name ?? null);
    }
  }, [adminLookupData, regionId, setRegion]);

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
          options={
            adminLookupData?.map((item) => ({
              value: item.id.toString(),
              label: item.name ?? "",
            })) ?? []
          }
          value={regionId ?? adminLookupData?.[0]?.id.toString() ?? null}
          onChange={handleRegionChange}
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
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-800">
                {adminProfile?.profilePicture ? (
                  <img
                    src={adminProfile.profilePicture}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  (adminProfile?.fullName?.charAt(0) || "A").toLocaleUpperCase()
                )}
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="font-semibold text-md">
                {adminProfile?.fullName
                  ? adminProfile.fullName
                  : adminProfile?.email?.split("@")[0]}
              </div>
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
