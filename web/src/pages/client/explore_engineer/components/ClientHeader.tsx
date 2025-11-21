import React from "react";
import { NavLink } from "react-router-dom";
import { absoluteUrls } from "@/config/urls";
import type { HeaderProps } from "@/shared/components/type";
import SortDropdown from "@/shared/components/SortDropdownClient";
import { Button } from "@/shared/components/commonUI/Buttons";


/**
 * A reusable header component for client-facing pages.
 * It displays a title, breadcrumb navigation, and optional search/sort and action button.
 *
 * @param {object} props - The props for the component.
 * @param {string} [props.title] - The main title to display. If not provided, `currentPath` is used.
 * @param {string} props.currentPath - The name of the current page, used in the breadcrumb.
 * @param {boolean} [props.showSearchBar=true] - Whether to display the search/sort dropdown.
 * @param {boolean} [props.showButton=false] - Whether to display the action button.
 * @param {string} [props.buttonText='Invite To Job'] - The text to display on the action button.
 * @param {() => void} [props.onClick] - The function to call when the action button is clicked.
 * @returns {React.ReactElement} A React functional component that renders the page header.
 */
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
                <span>Home/</span>
              </NavLink>
              <NavLink
                to={absoluteUrls.client.home.client_Explore_engineers}
                className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
              >
                <span>Services/</span>
              </NavLink>
              <NavLink
                to={absoluteUrls.client.home.client_Explore_engineers_details}
                className="hover:text-teal-800 text-[1rem] whitespace-nowrap"
              >
                <span>Network/</span>
              </NavLink>
              <span className="font-medium">{currentPath}</span>
            </nav>
          </div>

          {showSearchBar && <SortDropdown />}
          {showButton && (
            <Button
             onClick={onClick} 
             variant="primary" 
             type="submit"
             className="bg-teal-800 dark:bg-teal text-white"
             >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
