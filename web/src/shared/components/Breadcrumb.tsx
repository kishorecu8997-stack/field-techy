/**
 * Breadcrumb Component
 * Dynamically generates breadcrumb navigation from the current URL path.
 * Converts URL segments into human-readable labels (e.g., "/my-jobs" → "My Jobs").
 *
 * @param {Object} props - Component props
 * @param {string} [props.homeLabel='Home'] - Label for the root path
 * @param {Record<string, string>} [props.customLabels] - Optional custom label overrides
 * @returns {JSX.Element} Rendered breadcrumb trail
 */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface BreadcrumbProps {
  homeLabel?: string;
  customLabels?: Record<string, string>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  homeLabel = "Home",
  customLabels = {},
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  /**
   * Converts kebab-case or snake_case to Title Case
   * @param {string} str - Input string
   * @returns {string} Title-cased string
   */
  const formatLabel = (str: string): string => {
    // Use custom label if provided
    if (customLabels[str]) return customLabels[str];

    // Replace hyphens/underscores with spaces and title-case
    return str
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex items-center space-x-1">
        {/* Home Link */}
        <li>
          <a href="/" className="hover:text-emerald-600 transition-colors">
            {homeLabel}
          </a>
        </li>

        {/* Dynamic Path Segments */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 font-medium">
                  {formatLabel(value)}
                </span>
              ) : (
                <NavLink
                  to={to}
                  className="hover:text-teal-800 dark:hover:text-teal-400 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {" "}
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
