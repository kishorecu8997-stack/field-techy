// src/components/messages/MessagesHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import useDrawerStore from "@/shared/store/useDrawerStore";
import { HiOutlinePlus } from "react-icons/hi2";

interface MessagesHeaderProps {
  activeTab: "personal" | "group";
  setActiveTab: (tab: "personal" | "group") => void;
  onDrawerToggle: () => void;
}

/**
 * MessagesHeader component displays a header with a plus button, dropdown menu, and tab buttons.
 * It also provides functionality to toggle the drawer and switch between personal and group chats.
 *
 * @param {"personal" | "group"} activeTab - The current active tab.
 * @param {(tab: "personal" | "group") => void} setActiveTab - A function to handle tab changes.
 * @param {() => void} onDrawerToggle - A function to toggle the drawer.
 * @returns {JSX.Element} The MessagesHeader component.
 */
const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  activeTab,
  setActiveTab,  
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setActiveKey, setISOpenSidebar, isOpenSidebar, activeKey } = useDrawerStore();

  console.log("activeKey", activeKey);
  console.log("isOpenSidebar", isOpenSidebar);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Messages</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <span>Home / </span>
            <span className="text-teal-800">Messages</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* ✅ Wrap only the plus button in a relative container */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Create new chat"
            >
              <HiOutlinePlus size={20} className="text-gray-600" />
            </button>

            {/* ✅ Dropdown inside relative wrapper */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
              >
                <button
                  onClick={() => {
                    console.log("Personal Chat clicked");
                    setActiveKey("personalChats");
                    setISOpenSidebar(true);
                    // setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Personal Chat
                </button>
                <button
                  onClick={() => {
                    setActiveKey("groupChats");
                    setISOpenSidebar(true);
                    // setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Group Chat
                </button>
              </div>
            )}
          </div>

          {/* Tab buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 text-sm ${
                activeTab === "personal"
                  ? "bg-teal-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } transition-colors`}
            >
              Personal Chat
            </button>
            <button
              onClick={() => setActiveTab("group")}
              className={`px-4 py-2 text-sm ${
                activeTab === "group"
                  ? "bg-teal-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } transition-colors`}
            >
              Group Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesHeader;
