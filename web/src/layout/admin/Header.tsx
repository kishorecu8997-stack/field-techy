import { assetsConfig } from "@/assets";
import { useEffect, useRef, useState } from "react";
import { BsChevronDown, BsTextLeft } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { NavbarProps } from "./types";
import { absoluteUrls } from "@/config/urls";

const notifications = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function Header({ onToggleSidebar }: NavbarProps) {
  const [region, setRegion] = useState("Select Region");
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="text-white px-4 sm:px-6 py-2 shadow-lg flex justify-between items-center"
      style={{
        background: "linear-gradient(to right, #034444, #014d45)",
      }}
    >
      <div className="flex items-center space-x-4">
        <Link to="/admin" className="">
          <img
            src={assetsConfig.logos.ftLogoWhite}
            alt="FT Logo"
            className="w-auto"
          />
        </Link>
        <BsTextLeft
          onClick={onToggleSidebar}
          className="text-xl cursor-pointer"
        />
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-[#8390a2] dark:text-gray-400 px-3 py-2 rounded-md
      text-sm focus:outline-none focus:ring-1 dark:focus:ring-teal-400 appearance-none pr-8 cursor-pointer"
          >
            <option value="" className="text-gray-500 dark:text-gray-400">
              Select Region
            </option>
            <option value="US">United States</option>
            <option value="EU">Europe</option>
            <option value="AS">Asia</option>
            <option value="CA">Canada</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 dark:text-gray-400">
            <BsChevronDown />
          </div>
        </div>

        <div className="text-xl cursor-pointer">
          <FaRegBell onClick={() => setIsNotificationOpen((prev) => !prev)} />
        </div>

        {/* User Profile */}
        <Link to={absoluteUrls.admin.home.profile}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="font-bold text-gray-800">K</span>
            </div>

            <div className="hidden sm:block">
              <div className="font-semibold text-md">Kevin Smith</div>
              <div className="text-xs text-gray-300">Admin</div>
            </div>
          </div>
        </Link>
      </div>

      {isNotificationOpen && (
        <div
          className="bg-white absolute md:right-20 mt-80 z-10 max-h-96 dark:bg-gray-800 rounded-xs shadow dark:shadow-2xl overflow-hidden"
          ref={dropdownRef}
        >
          <div className="flex justify-between items-center px-4 py-2 bg-[#004e91] text-white">
            <h2 className="font-semibold">Notifications</h2>
            <Link
              to={absoluteUrls.admin.home.received_notification}
              className="text-sm cursor-pointer underline hover:text-blue-200"
              onClick={() => setIsNotificationOpen(false)}
            >
              See All
            </Link>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 ">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-start px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0 mr-3"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="grid">
                      <span className="font-medium text-gray-900 dark:text-white">
                        John Doe
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Lorem ipsum dolor sit amet
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                      1 day ago
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
