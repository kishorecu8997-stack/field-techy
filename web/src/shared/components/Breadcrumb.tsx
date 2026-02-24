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
  segments,
  onSegmentClick,
}) => {
  const location = useLocation();

  let breadcrumbSegments: string[];
  let root = location.pathname.includes("client") ? "client" : "engineer";
  if (segments && segments.length > 0) {
    breadcrumbSegments = segments.slice(1);
    root = segments[0].toLowerCase();
  } else {
    const allSegments = location.pathname.split("/").filter(Boolean);
    const engineerIndex = allSegments.indexOf(root);
    if (engineerIndex === -1) {
      return null;
    }
    breadcrumbSegments = allSegments.slice(engineerIndex + 1);
  }

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
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-500 dark:text-gray-300"
    >
      <ol className="flex items-center space-x-1">
        {/* Home link points to /engineer or /client */}
        <li>
          <NavLink
            to={`/${root}`}
            className="hover:text-emerald-600 transition-colors"
          >
            {homeLabel}
          </NavLink>
        </li>

        {breadcrumbSegments.map((value, index) => {
          // Build path: /engineer + segments up to current
          const to = `/${root}/${breadcrumbSegments.slice(0, index + 1).join("/")}`;
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
                  onClick={() => {
                    if (onSegmentClick) onSegmentClick(value, index); // CALL PARENT HANDLER
                  }}
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
