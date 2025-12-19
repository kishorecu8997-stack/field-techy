import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                      bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0
                      pointer-events-none group-hover:opacity-100 transition-opacity">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
