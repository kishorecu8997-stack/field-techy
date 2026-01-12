import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface Option {
  value: string;
  label: string;
  bg?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SimpleSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
  className?: string;
  badge?: boolean;
}

/**
 * A simple and reusable select menu component that automatically adjusts
 * its dropdown position (top or bottom) based on available space.
 *
 * @param {SimpleSelectProps} props The props for the component.
 * @returns {JSX.Element} The rendered select menu component.
 */
const SelectMenu = ({
  options,
  placeholder = "Select an option",
  onChange,
  value: selectedValue,
  className = "",
  badge,
}: SimpleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 👇 Detect scrollable parent and calculate space
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();

    //Find nearest scrollable parent (you can adjust selector if needed)
    let scrollContainer: HTMLElement | null = null;
    let parent = triggerRef.current.parentElement;

    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflowY === "auto" ||
        style.overflowY === "scroll" ||
        style.maxHeight !== "none"
      ) {
        scrollContainer = parent;
        break;
      }
      parent = parent.parentElement;
    }

    // If no scrollable parent found, fall back to viewport
    const containerRect = scrollContainer
      ? scrollContainer.getBoundingClientRect()
      : {
          top: 0,
          bottom: window.innerHeight,
          height: window.innerHeight,
        };

    // Calculate available space below and above within container
    const spaceBelow = containerRect.bottom - triggerRect.bottom; // space below trigger inside container
    const spaceAbove = triggerRect.top - containerRect.top; // space above trigger inside container

    const menuHeight = 200; // Approximate height of menu (adjust if needed)

    // Flip to top only if not enough space below AND enough space above
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={`relative inline-block ${className}`} ref={wrapperRef}>
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`flex space-x-2 items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-800 rounded-md
         ${
           badge ? `${selectedOption?.bg ?? ""}` : "bg-white dark:bg-gray-800"
         } cursor-pointer hover:border-gray-400 min-w-[120px]`}
      >
        <span
          className={` ${
            badge ? `${selectedOption?.bg ?? ""}` : " text-gray-700"
          } truncate text-sm dark:text-[#979ba2]`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {badge ? (
          <span className="mt-0.5 w-4 h-4">
            {selectedOption?.icon ? (
              <selectedOption.icon className="w-4 h-4" />
            ) : (
              <MdKeyboardArrowDown
                className={`text-xl text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </span>
        ) : (
          <MdKeyboardArrowDown
            className={`text-xl text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isOpen && (
        <ul
          className={`absolute z-10 w-full ${
            position === "bottom"
              ? "top-full mt-1" // Open downward
              : "bottom-full mb-1" // Open upward
          } bg-white border text-gray-800 dark:text-white dark:bg-gray-800 
          border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                handleSelect(option);
              }}
              className={`flex items-center gap-x-1 px-3 py-2 cursor-pointer text-sm ${
                badge
                  ? `${option?.bg ?? "bg-gray-100"}`
                  : option.value === selectedValue
                    ? "bg-emerald-100 text-gray-900 font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-blue-400"
              }`}
            >
              {badge && option.icon && (
                <option.icon className="inline w-4 h-4 ml-2" />
              )}

              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMenu;
