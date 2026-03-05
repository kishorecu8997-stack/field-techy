import React, { useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

/**
 * Simple Accordion component
 */
export const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  remove?: () => void;
  defaultOpen?: boolean;
}> = ({ title, children, remove, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-300 dark:border-gray-600">
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-lg font-semibold text-gray-800 dark:text-neutral-200 cursor-pointer"
      >
        {title}
        <div className="flex items-center space-x-2">
          <RiDeleteBin6Fill
            className=" text-red-400 cursor-pointer hover:text-red-500 "
            size={20}
            onClick={(e) => {
              remove?.();
              e.stopPropagation();
            }}
          />
          <span className="cursor-pointer">{open ? "▾" : "▸"}</span>
        </div>
      </div>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};
