import { useState, useRef, useEffect, type ReactNode } from 'react';

interface AccordionItem {
  id: string | number;
  label: string;
  content: ReactNode;
  icon?: ReactNode; // Optional icon to show next to the label
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconPosition?: 'left' | 'right'; // Position of the chevron (not the label icon)
}

const Accordion = ({
  items,
  className = '',
  titleClassName = '',
  contentClassName = '',
  iconPosition = 'right'
}: AccordionProps) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);

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
  iconPosition
}: {
  item: AccordionItem;
  isOpen: boolean;
  toggle: () => void;
  titleClassName: string;
  contentClassName: string;
  iconPosition: 'left' | 'right';
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, item.content]);

  return (
    <div className="border-b border-gray-200 last:border-b-0 overflow-hidden">
      <button
        onClick={toggle}
        className={`flex w-full items-center justify-between p-4 text-left font-medium bg-white hover:bg-gray-50 transition-colors ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center min-w-0">
          {iconPosition === 'left' && (
            <ChevronIcon isExpanded={isOpen} className="mr-3 flex-shrink-0" />
          )}
          {item.icon && <span className="mr-3 flex-shrink-0">{item.icon}</span>}
          <span className="truncate">{item.label}</span>
        </div>

        {iconPosition === 'right' && <ChevronIcon isExpanded={isOpen} />}
      </button>

      <div
        ref={contentRef}
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${contentClassName}`}
        style={{
          maxHeight: contentHeight !== undefined ? `${contentHeight}px` : '0px',
        }}
        aria-hidden={!isOpen}
      >
        <div className="p-4 border-t border-gray-100">
          {item.content}
        </div>
      </div>
    </div>
  );
};

// Reusable Chevron Icon (for expand/collapse)
const ChevronIcon = ({ 
  isExpanded, 
  className = '' 
}: { 
  isExpanded: boolean; 
  className?: string 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default Accordion;