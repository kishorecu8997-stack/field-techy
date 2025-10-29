import React from "react";
import { NavLink } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import SortDropdown from "./SortDropdown";

interface HeaderProps {
  title?: string;
  currentPath: string;
  showSearchBar?: boolean;
}

const ClientHeader: React.FC<HeaderProps> = ({ title,currentPath, showSearchBar=true }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title || currentPath}
            </h1>
            <nav className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <NavLink
                to={absoluteUrls.client.home.dashboard}
                className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
              >
                <span>Home / </span>
              </NavLink>
              <span className="font-medium">{currentPath}</span>
            </nav>
          </div>

          {showSearchBar && (
            <SortDropdown />
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
