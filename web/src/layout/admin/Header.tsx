import { assetsConfig } from "@/assets";
import { useRef, useState, useMemo } from "react";
import { BsTextLeft } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { type NavbarProps } from "./types";
import { absoluteUrls } from "@/config/urls";
import SelectMenu from "@/shared/components/SelectMenu";
import { useAdminProfile } from "@/shared/store/useAdminProfileStore";
import { useAdminCountryStore } from "@/shared/store/useAdminCountryStore";
import { useUserSessionStore } from "@/shared/store/useUserSessionStore";
import { useAdminRegionParam } from "@/shared/hooks/useAdminRegionParam";

import {
  useAppMarkAllNotificationsAsRead,
  useAppMarkNotificationAsRead,
  useAppNotifications,
} from "@/shared/apiServices/notifications/notificationOpenApiService";

import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { RiCloseLine } from "react-icons/ri";
/**
 * Header
 *
 * Top navigation component for the admin dashboard. Provides navigation controls,
 * region selection, notifications panel, and user profile access.
 *
 * Features:
 * - Sidebar toggle control
 * - Region selection dropdown (admin only; hidden for sub-admins)
 * - Notifications panel with click-outside behavior
 * - User profile section with avatar and role display
 *
 * Region URL sync is handled externally by AdminRegionSync (mounted in AdminLayout).
 *
 * @param {NavbarProps} props - Component props
 * @param {Function} props.onToggleSidebar - Callback to toggle the sidebar visibility
 * @returns {JSX.Element} Header component with navigation controls and user interface
 */
export default function Header({ onToggleSidebar }: NavbarProps) {
  const { regionId } = useAdminCountryStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const subRegionId = useUserSessionStore((s) => s.session?.regionId);

  const adminProfile = useAdminProfile();
  const { setRegionParam, adminLookupData } = useAdminRegionParam();

  const { notifications } = useAppNotifications();
  const markAsRead = useAppMarkNotificationAsRead();
  const markAllAsRead = useAppMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 5);
  }, [notifications]);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className="text-white px-4 sm:px-6 py-2 shadow-lg flex justify-between items-center"
        style={{
          background: "linear-gradient(to right, #034444, #014d45)",
        }}
      >
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard">
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
          {!subRegionId && (
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
              onChange={setRegionParam}
            />
          )}
          <div
            className="text-xl cursor-pointer relative"
            ref={bellRef}
            onClick={toggleNotifications}
          >
            <FaRegBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <Link to={absoluteUrls.admin.home.profile}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                {adminProfile?.profilePicture ? (
                  <img
                    src={adminProfile.profilePicture}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-gray-800">
                    {(adminProfile?.fullName?.charAt(0) || "A").toUpperCase()}
                  </span>
                )}
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
      </header>

      {/* Notification Sidebar */}
      {isNotificationOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsNotificationOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-[380px] bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h2 className="font-semibold text-lg">Recent Alerts</h2>

              <div className="flex justify-end text-2xl cursor-pointer text-gray-500 hover:text-black">
                <RiCloseLine onClick={() => setIsNotificationOpen(false)} />
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 flex justify-between items-center border-b">
              <Link
                to={absoluteUrls.admin.home.received_notification}
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setIsNotificationOpen(false)}
              >
                View All
              </Link>

              {notifications.some((n) => !n.read) && (
                <Button
                  variant="no_style"
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  disabled={markAllAsRead.isPending}
                  onClick={async () => {
                    try {
                      await markAllAsRead.mutateAsync({});
                    } catch {
                      toast.error(
                        "Failed to mark all notifications as read. Please try again.",
                      );
                    }
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications */}
            <div className="flex-1 overflow-y-auto">
              {recentNotifications.length === 0 && (
                <div className="px-5 py-4 text-sm text-gray-500">
                  No notifications
                </div>
              )}

              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start px-5 py-4 border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={async () => {
                    if (!n.read) {
                      await markAsRead.mutateAsync({
                        body: { id: Number(n.id) },
                      });
                    }
                  }}
                >
                  {/* Icon circle */}
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <FaRegBell className="text-gray-600 dark:text-gray-300 text-sm" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{n.title}</span>

                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
