import React from "react";
import type { MenuItem, SettingsMenuProps, ToggleSwitchProps } from "../../../pages/engineer/account_settings/types";
import { icons } from "@/config/icons";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
        checked ? "bg-teal-600" : "bg-gray-300 dark:bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

/**
 * Renders a styled settings menu with interactive items that can be either clickable actions or toggle switches.
 * Supports icons, hover effects, accessibility attributes, and disabled states.
 */
const DrawerMenuSection: React.FC<SettingsMenuProps> = ({
  items,
  className = "",
  ariaLabel = "Settings Menu",
}) => {
  const handleItemClick = (item: MenuItem) => {
    if (item.onClick && !item.isToggle) {
      item.onClick();
    }
  };

  return (
    <nav
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      aria-label={ariaLabel}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <li key={item.id}>
            <div
              className={` w-full flex items-center justify-between px-4 py-4 
              transition-all duration-300 cursor-pointer text-gray-700 dark:text-gray-200 
              hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-6 
              hover:text-teal-600 dark:hover:text-teal-400
                ${
                  item.disabled
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer dark:hover:bg-gray-750 hover:bg-gray-50 hover:text  hover:pl-5"
                }`}
              onClick={() => !item.disabled && handleItemClick(item)}
              role={item.isToggle ? "none" : "button"}
              tabIndex={item.isToggle || item.disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (
                  !item.isToggle &&
                  !item.disabled &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  handleItemClick(item);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>

              {item.isToggle ? (
                <ToggleSwitch
                  checked={item.toggleValue || false}
                  onChange={(value) => item.onToggleChange?.(value)}
                  disabled={item.disabled}
                />
              ) : (
                <icons.chevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DrawerMenuSection;
