import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaBell, FaComment } from "react-icons/fa";
import { TbAlignLeft } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { JobSearchBar } from "./JobSearchBar";
import useDrawerStore from "../store/useDrawerStore";
import Drawer from "./drawer/Drawer";
import type { NavbarProps } from "./type";

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
const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle, isDrawerOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { setActiveKey } = useDrawerStore();
  const navigate = useNavigate();

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

  return (
    <header className="flex items-center justify-between px-6 py-4 dark:bg-gray-300 ">
      <div className="flex items-center space-x-8 ">
        <img
          src={assetsConfig.logos.ftLogo}
          alt="FT Logo"
          className="h-12 w-auto cursor-pointer"
          onClick={() => navigate(absoluteUrls.engineer.home.dashboard)}
        />
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <NavLink
            to={absoluteUrls.engineer.home.my_jobs}
            className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
          >
            My Jobs
          </NavLink>
          <div
            // to={absoluteUrls.engineer.home.my_jobs}

            onClick={() => {
              onDrawerToggle();
              setActiveKey("myEarning");
            }}
            className="hover:text-teal-800 text-[1rem] whitespace-nowrap cursor-pointer"
          >
            Earning
          </div>
        </nav>
      </div>

      {/* Middle Section: Search Bar - Flexible but not greedy */}
      <div className="flex-1 mx-4 max-w-[500px]">
        {/* <Link to={absoluteUrls.engineer.home.search_result}> */}
        <JobSearchBar />
        {/* </Link> */}
      </div>

      {/* Right Section: Icons + Profile Button */}
      <div className="flex items-center space-x-4 md:hidden">
        <div
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-900 relative cursor-pointer"
        >
          <FaBars size={20} />
        </div>

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
              <div className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">Earning</div>
              </div>
              <div
                className="w-full flex items-center cursor-pointer px-4 py-3 text-left hover:bg-gray-100"
                onClick={onDrawerToggle}
              >
                <div className="flex items-center space-x-3">My Account</div>
              </div>
              <div className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 cursor-pointer">
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
          className="relative p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          //  onClick={() => navigate(absoluteUrls.engineer.home.chat)}
        >
          <FaComment size={20} />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </div>
        <div
          className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={() => {
            onDrawerToggle();
            setActiveKey("notification");
          }}
        >
          <FaBell size={20} />
        </div>
        <div
          onClick={onDrawerToggle}
          className="flex items-center space-x-2 bg-teal-800 text-white pl-2 pr-1 py-2 rounded-full hover:bg-teal-900 transition cursor-pointer flex-row gap-2"
        >
          <TbAlignLeft className="h-5 w-5" />
          <span className="max-w-[6rem] truncate text-left">Hi, Nick Wilson</span>
          <img
            src={assetsConfig.images.users.user}
            alt="User"
            className="h-8 w-8 rounded-full bg-white"
          />
        </div>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={onDrawerToggle} />
    </header>
  );
};

export default Navbar;
