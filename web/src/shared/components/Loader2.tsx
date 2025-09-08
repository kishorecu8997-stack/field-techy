import React from "react";

/**
 * Loader2 Component
 *
 * A reusable SVG loader/spinner icon.
 *
 * Features:
 * - Accepts all standard SVG attributes via props (e.g., `className`, `stroke`, `width`, `height`).
 * - Uses current text color (`stroke="currentColor"`) for styling.
 *
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG attributes and class names
 * @returns {JSX.Element} The rendered SVG loader icon
 *
 * @example
 * <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
 */
const Loader2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4a8 8 0 1 1-8 8"
    />
  </svg>
);

export default Loader2;
