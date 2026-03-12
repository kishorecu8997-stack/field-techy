import React, { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

/*
This component is used to display a tooltip.
It is used in the engineer's account settings page.
It is used to display a tooltip.
It is used to display a tooltip.
*/
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div
      className="relative flex items-center text-white"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {children}
      {isTooltipVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-max max-w-xs p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
