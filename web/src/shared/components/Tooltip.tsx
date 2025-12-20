import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div
        className="absolute left-1/2 -translate-x-1/2 mt-2
                  hidden group-hover:block
                  whitespace-nowrap
                  bg-gray-900 text-white text-xs
                  px-3 py-1 rounded shadow-lg z-50"
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
