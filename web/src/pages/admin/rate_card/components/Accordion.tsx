import React, { useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

/**
 * Simple Accordion component
 */
export const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  remove?: () => void;
}> = ({ title, children, remove }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-lg font-semibold text-gray-800 dark:text-neutral-200"
      >
        {title}
        <div className="flex items-center space-x-2">
          <RiDeleteBin6Fill
            className=" text-red-400 cursor-pointer hover:text-red-500 "
            size={20}
            onClick={(e) => {
              console.log("deleted");
              remove?.();
              e.stopPropagation();
            }}
          />
          <span className="cursor-pointer">{open ? "▾" : "▸"}</span>
        </div>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};
