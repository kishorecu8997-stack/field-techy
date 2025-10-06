import { type JSX } from "react";

/**
 * MyJobLayout Component
 * Splits content into a 3:1 ratio layout (left: 75%, right: 25%).
 * Responsive: Stacks vertically on mobile, horizontal on medium+ screens.
 * Assumes it's rendered inside a flex container with constrained height.
 *
 * @returns {JSX.Element} Layout with independently scrollable panels
 */
const MyJobLayout = ({
  rightPanelContent,
  leftPanelContent,
}: {
  rightPanelContent: JSX.Element;
  leftPanelContent: JSX.Element;
}) => {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto flex-1">
      <div className="w-full md:w-3/4 md:pr-4 mb-4 md:mb-0 flex flex-col">
        <div className="flex-1 p-2 overflow-y-auto">{leftPanelContent}</div>
      </div>
      <div className="w-full md:w-1/4 flex flex-col">
        <div className="flex-1 p-2 overflow-y-auto">{rightPanelContent}</div>
      </div>
    </div>
  );
};

export default MyJobLayout;
