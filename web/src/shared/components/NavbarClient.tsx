import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import {
  useClientProfile,
  useClientStore,
} from "@/shared/store/useClientStore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaBars, FaBell, FaComment } from "react-icons/fa";
import { TbAlignLeft } from "react-icons/tb";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useDrawerStore from "../store/useDrawerStore";
import Drawer from "./drawer/Drawer";
import IconWithTheme from "./IconWithTheme";
import { JobSearchBarClient } from "./jobSearchBarClient";

interface NavbarClientProps {
  onDrawerToggle: () => void;
  isDrawerOpen: boolean;
}

/**
 * Header component with navigation, search bar, and user profile.
 * Features responsive design with mobile menu, dark mode support, and notification badges.
 * Clicking the profile button opens a drawer from the right side.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onDrawerToggle - Function to toggle the profile drawer
 * @param {boolean} props.isDrawerOpen - Boolean indicating if the profile drawer is open
 *
 * @example
 * <Header
 *   onDrawerToggle={() => setIsDrawerOpen(prev => !prev)}
 *   isDrawerOpen={isDrawerOpen}
 * />
 */
const NavbarClient: React.FC<NavbarClientProps> = ({
  onDrawerToggle,
  isDrawerOpen,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveKey } = useDrawerStore();
  const notificationCount = 3;

  const { profileImageUrl, loading: isLoadingProfile } = useClientStore();

  // Use custom hook to ensure profile is fetched
  const clientProfile = useClientProfile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get display name from client profile
  const displayName = useMemo(() => {
    if (!clientProfile) return "Guest";

    // For corporate clients, prefer company name, fallback to contact person name
    // For home clients, use contact person name
    if (clientProfile.clientType === "CORPORATE") {
      return (
        clientProfile.companyName || clientProfile.contactPersonName || "Client"
      );
    }
    return clientProfile.contactPersonName || "Client";
  }, [clientProfile]);

  return (
    <header className="flex items-center justify-between px-6 py-4 dark:bg-gray-900 ">
      <div className="flex items-center space-x-8 ">
        <span onClick={() => navigate(absoluteUrls.client.home.dashboard)}>
          <IconWithTheme
            lightLogo={assetsConfig.logos.ftLogo}
            darkLogo={assetsConfig.logos.ftLogoWhite}
            header
          />
        </span>

        <NavLink
          to={absoluteUrls.client.home.my_projects}
          className={`${
            location.pathname.startsWith(absoluteUrls.client.home.my_projects)
              ? "text-teal-800 font-semibold"
              : ""
          } hover:text-teal-800 text-[1rem] whitespace-nowrap`}
        >
          My Projects
        </NavLink>
        <NavLink
          to={absoluteUrls.client.home.my_jobs}
          className={`${
            location.pathname.startsWith(absoluteUrls.client.home.my_jobs)
              ? "text-teal-800 font-semibold"
              : ""
          } hover:text-teal-800 text-[1rem] whitespace-nowrap`}
        >
          My Jobs
        </NavLink>
        <div
          onClick={() => {
            onDrawerToggle();
            setActiveKey("clientWallet");
          }}
          className="hover:text-teal-800 text-[1rem] whitespace-nowrap cursor-pointer"
        >
          Wallet
        </div>
      </div>

      <div className="flex-1 mx-4 max-w-[500px]">
        <JobSearchBarClient />
      </div>

      <div className="flex items-center space-x-4 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-900 relative"
        >
          <FaBars size={20} />
        </button>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-16 right-6 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50"
          >
            <div className="py-2">
              <div className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <span>My Jobs</span>
                </div>
              </div>
              <div
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onDrawerToggle();
                  setActiveKey("clientWallet");
                }}
              >
                <div className="flex items-center space-x-3">Wallet</div>
              </div>
              <div
                className="w-full flex items-center cursor-pointer px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  onDrawerToggle();
                }}
              >
                <div className="flex items-center space-x-3">My Account</div>
              </div>
              <div
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(absoluteUrls.client.home.chat);
                }}
              >
                <div className="flex items-center space-x-3">
                  <FaBell className="mr-3" size={18} />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </div>
              <div className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <FaComment className="mr-3" size={18} />
                  <span>Messages</span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop buttons - hidden on mobile */}
      <div className="hidden md:flex items-center space-x-4">
        <div
          className="relative p-2 text-gray-600 hover:text-gray-900 dark:hover:text-gray-600 cursor-pointer"
          onClick={() => {
            navigate(absoluteUrls.client.home.chat);
          }}
        >
          <FaComment size={20} />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </div>
        <div
          className="p-2 relative text-gray-600 hover:text-gray-900 dark:hover:text-gray-600 cursor-pointer"
          onClick={() => {
            onDrawerToggle();
            setActiveKey("clientNotification");
          }}
        >
          <FaBell size={20} />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notificationCount}
          </span>
        </div>
        <div
          onClick={() => {
            onDrawerToggle();
            setActiveKey("clientAccount");
          }}
          className="flex items-center space-x-2 bg-teal-800 text-white pl-2 pr-1 py-2 rounded-full hover:bg-teal-900 transition cursor-pointer flex-row gap-2"
        >
          <TbAlignLeft className="h-5 w-5" />
          <span className="max-w-24 truncate text-left">
            {isLoadingProfile ? "Loading..." : `Hi, ${displayName}`}
          </span>
          {isLoadingProfile ? (
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <div className="h-4 w-4 border-2 border-teal-800 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <img
              src={profileImageUrl || assetsConfig.images.users.user}
              alt={clientProfile?.contactPersonName || "User"}
              className="h-8 w-8 rounded-full bg-white object-cover"
              onError={(e) => {
                // Fallback to default image if profile picture fails to load
                (e.target as HTMLImageElement).src =
                  assetsConfig.images.users.user;
              }}
            />
          )}
        </div>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={onDrawerToggle} />
    </header>
  );
};

export default NavbarClient;
