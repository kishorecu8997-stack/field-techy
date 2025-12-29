import React from "react";
import { useState } from "react";
interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

/**
 * Tooltip component that displays a tooltip on hover or focus.
 * Accepts a text prop and a child element.
 * Renders a tooltip div with the text and child element.
 */
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="relative group inline-block">
      <div
        tabIndex={0} 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={tooltipId}
      >
        {children}
      </div>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 mt-2
                  hidden group-hover:block
                  whitespace-nowrap
                  bg-gray-900 text-white text-xs
                  px-3 py-1 rounded shadow-lg z-50"
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
