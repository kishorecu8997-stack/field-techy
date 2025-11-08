import React from "react";
import { NavLink } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import SortDropdown from "./SortDropdown";
import { Button } from "./commonUI/Buttons";

interface HeaderProps {
  title?: string;
  currentPath: string;
  showSearchBar?: boolean;
  showButton?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

const ClientHeader: React.FC<HeaderProps> = ({
  title,
  currentPath,
  showSearchBar = true,
  showButton = false,
  buttonText = "Invite To Job",
  onClick,
}) => {
  return (
    <header className=" border-b border-gray-200 dark:border-gray-700">
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

          {showSearchBar && <SortDropdown />}
          {showButton && (
            <Button onClick={onClick} variant="primary" type="submit">
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
