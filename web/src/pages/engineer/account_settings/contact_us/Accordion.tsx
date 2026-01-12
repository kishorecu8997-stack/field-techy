import { useEffect, useRef, useState } from "react";
import type { AccordionItem, AccordionProps } from "../types";

/**
 * A reusable, animated accordion component that supports optional icons, customizable chevron position,
 * and smooth height transitions. Only one item can be expanded at a time.
 */
const Accordion = ({
  items,
  className = "",
  titleClassName = "",
  contentClassName = "",
  iconPosition = "right",
}: AccordionProps) => {
  const [activeId, setActiveId] = useState<string | number | null>("1");

  const toggleItem = (id: string | number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={activeId === item.id}
          toggle={() => toggleItem(item.id)}
          titleClassName={titleClassName}
          contentClassName={contentClassName}
          iconPosition={iconPosition}
        />
      ))}
    </div>
  );
};

// Individual accordion item with transition and optional label icon
const AccordionItemComponent = ({
  item,
  isOpen,
  toggle,
  titleClassName,
  contentClassName,
  iconPosition,
}: {
  item: AccordionItem;
  isOpen: boolean;
  toggle: () => void;
  titleClassName: string;
  contentClassName: string;
  iconPosition: "left" | "right";
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, item.content]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 overflow-hidden">
      <button
        onClick={toggle}
        className={`w-full flex items-center justify-between px-4 py-4 
              transition-all duration-300 cursor-pointer text-gray-700 dark:text-gray-200 
              hover:bg-gray-50 dark:hover:bg-gray-700 
          ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center min-w-0">
          {iconPosition === "left" && (
            <ChevronIcon
              isExpanded={isOpen}
              className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400"
            />
          )}
          {item.icon && (
            <span className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400">
              {item.icon}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </div>

        {iconPosition === "right" && (
          <ChevronIcon
            isExpanded={isOpen}
            className="text-gray-500 dark:text-gray-400"
          />
        )}
      </button>

      <div
        ref={contentRef}
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${contentClassName}`}
        style={{
          maxHeight: contentHeight !== undefined ? `${contentHeight}px` : "0px",
        }}
        aria-hidden={!isOpen}
      >
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
          {item.content}
        </div>
      </div>
    </div>
  );
};

// Reusable Chevron Icon (for expand/collapse)
const ChevronIcon = ({
  isExpanded,
  className = "",
}: {
  isExpanded: boolean;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default Accordion;
