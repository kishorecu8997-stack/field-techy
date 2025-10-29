import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { BreadcrumbProps } from "./type";

/**
 * Breadcrumb Component
 * Dynamically generates breadcrumb navigation from the current URL path,
 * starting from /engineer as the root.
 *
 * @param {Object} props - Component props
 * @param {string} [props.homeLabel='Home'] - Label for the /engineer path
 * @param {Record<string, string>} [props.customLabels] - Optional custom label overrides
 * @returns {JSX.Element} Rendered breadcrumb trail
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  homeLabel = "Home",
  customLabels = {},
}) => {
  const location = useLocation();

  // Split current path and remove empty segments
  const allSegments = location.pathname.split("/").filter(Boolean);

  // Find index of 'engineer' in the path
  const engineerIndex = allSegments.indexOf("engineer");

  // If 'engineer' is not in the path, show nothing or fallback
  if (engineerIndex === -1) {
    return null; // or return a default breadcrumb if needed
  }

  // Get segments AFTER /engineer
  const breadcrumbSegments = allSegments.slice(engineerIndex + 1);

  /**
   * Converts kebab-case or snake_case to Title Case
   */
  const formatLabel = (str: string): string => {
    if (customLabels[str]) return customLabels[str];
    return str
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex items-center space-x-1">
        {/* Home link points to /engineer */}
        <li>
          <NavLink
            to="/engineer"
            className="hover:text-emerald-600 transition-colors"
          >
            {homeLabel}
          </NavLink>
        </li>

        {breadcrumbSegments.map((value, index) => {
          // Build path: /engineer + segments up to current
          const to = `/engineer/${breadcrumbSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === breadcrumbSegments.length - 1;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 font-medium dark:text-gray-500">
                  {formatLabel(value)}
                </span>
              ) : (
                <NavLink
                  to={to}
                  className="hover:text-teal-800 dark:hover:text-teal-400 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {formatLabel(value)}
                </NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;