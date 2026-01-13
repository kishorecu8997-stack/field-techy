import { absoluteUrls } from "@/config/urls";
import { forwardRef } from "react";
import type { UserTypeDropdownProps } from "../type";

/**
 * UserTypeDropdown component for the homepage.
 *
 * @returns {JSX.Element} The rendered user type dropdown component.
 * @param {UserTypeDropdownProps} props - The props for the user type dropdown component.
 */
const UserTypeDropdown = forwardRef<HTMLDivElement, UserTypeDropdownProps>(
  (
    {
      title = "Select Account Type",
      selected,
      onSelect,
      options,
      className = "",
    },
    ref,
  ) => {
    const handleLogin = (id: string) => {
      if (id === "engineer") {
        window.open(absoluteUrls.engineer.auth.login, "_blank");
      } else if (id === "corporate") {
        window.open(absoluteUrls.client.auth.login, "_blank");
      } else if (id === "home-client") {
        window.open(absoluteUrls.client.auth.login, "_blank");
      }
    };

    const handleSignUp = (id: string) => {
      if (id === "engineer") {
        window.open(absoluteUrls.engineer.auth.signup, "_blank");
      } else if (id === "corporate") {
        window.open(absoluteUrls.client.auth.signup, "_blank");
      } else if (id === "home-client") {
        window.open(absoluteUrls.client.auth.signup, "_blank");
      }
    };

    return (
      <div
        ref={ref}
        className={`absolute mx-2 md:mx-0 md:right-10 2xl:right-52 top-18 z-30 md:w-lg overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-gray-800 ${className}`}
        role="menu"
        aria-label={title}
      >
        <div className="bg-white dark:bg-gray-800 p-4">
          <div className="">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => onSelect(option.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(option.id);
                  }
                }}
                className={`flex flex-col p-4 cursor-pointer
                ${
                  selected === option.id
                    ? "bg-gray-100 dark:bg-gray-700 rounded-lg"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="font-medium text-lg text-gray-900 dark:text-white">
                  {option.title}
                </span>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {option.description}
                </p>
                {selected === option.id && (
                  <div className="flex items-center justify-end gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      New User?
                    </div>
                    <div
                      onClick={() => handleSignUp(option.id)}
                      className="text-sm text-[#026e71] underline hover:text-[#038286]"
                    >
                      Sign Up
                    </div>
                    <div
                      onClick={() => handleLogin(option.id)}
                      className="px-6 py-2 bg-[#026e71] text-white rounded-full text-sm font-medium hover:bg-[#038286] transition-colors"
                    >
                      Login
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

export default UserTypeDropdown;
