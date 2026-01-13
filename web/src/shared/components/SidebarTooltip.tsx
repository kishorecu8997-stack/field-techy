import React, { useState } from "react";
import { createPortal } from "react-dom";

// Validated Tooltip Component using Portal
export const SidebarTooltip = ({
  text,
  children,
  active = true,
}: {
  text: string;
  children: React.ReactNode;
  active?: boolean;
}) => {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top + rect.height / 2,
      left: rect.right,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        className="w-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {active &&
        isVisible &&
        coords &&
        createPortal(
          <div
            className="fixed z-[9999] px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in transition-opacity duration-200"
            style={{
              top: coords.top,
              left: coords.left + 5,
              transform: "translateY(-50%)",
            }}
          >
            {text}
            {/* Arrow pointing left */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>,
          document.body,
        )}
    </>
  );
};
