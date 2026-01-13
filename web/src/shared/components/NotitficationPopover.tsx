import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { NotificationDropdownProps } from "./type";

/**
 * Props for the NotificationDropdown component.
 * @interface
 * @property {string} [title="Notifications"] - Header text for the dropdown.
 * @property {string} [seeAllLink] - URL for the "See All" link. If not provided, link is hidden.
 * @property {() => void} [onClose] - Optional callback when dropdown is closed via "See All".
 * @property {React.ReactNode} children - Content to render in the scrollable dropdown area.
 * @property {string} [className] - Additional CSS classes for the root container.
 */

/**
 * NotificationDropdown - A styled dropdown for displaying notifications.
 *
 * Features:
 * - Fixed position dropdown with shadow and rounded corners
 * - Customizable header with optional "See All" link
 * - Scrollable content area with dividers between items
 * - Dark mode support
 * - Accessible via ARIA attributes
 * - Forward ref support for positioning/animations
 *
 * @component
 * @param {NotificationDropdownProps} props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref for dropdown positioning
 * @returns {JSX.Element} - The notification dropdown component
 */
const NotificationDropdown = forwardRef<
  HTMLDivElement,
  NotificationDropdownProps
>(
  (
    { title = "Notifications", seeAllLink, onClose, children, className = "" },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`absolute md:right-20 top-18 z-50 w-86 max-h-96 overflow-hidden rounded-md shadow-lg bg-white dark:bg-gray-800 ${className}`}
        role="menu"
        aria-label={title}
      >
        <div className="flex justify-between items-center px-4 py-3 bg-[#004e91] text-white">
          <h2 className="font-semibold text-sm">{title}</h2>
          {seeAllLink && (
            <Link
              to={seeAllLink}
              className="text-xs underline hover:text-blue-200 transition-colors"
              onClick={() => {
                onClose?.();
              }}
            >
              See All
            </Link>
          )}
        </div>

        <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  },
);

export default NotificationDropdown;
