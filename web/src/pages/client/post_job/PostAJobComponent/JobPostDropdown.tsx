import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { PostOption } from "../types";

/**
 * JobPostDropdown Component
 * A dropdown component for selecting a job posting option.
 * @param {Object} props - The component props.
 * @param {PostOption[]} props.options - The list of job posting options.
 * @param {boolean} [props.showViewAll] - Whether to show the "View All" option.
 * @param {string} [props.label] - The label for the dropdown button.
 *
 * @returns {JSX.Element} The rendered dropdown component.
 */
export default function JobPostDropdown({
  options,
  showViewAll = false,
  label,
}: {
  options: PostOption[];
  showViewAll?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PostOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "left",
  );

  // Smart positioning
  useEffect(() => {
    if (open && dropdownRef.current && menuRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      // If menu overflows right boundary → align right
      if (buttonRect.left + menuRect.width > screenWidth) {
        setDropdownPosition("right");
      } else {
        setDropdownPosition("left");
      }
    }
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left text-neutral-800 space-y-1"
    >
      {/* Trigger button */}
      <div
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-full transition flex items-center gap-2 justify-center bg-emerald-600 text-neutral-200 dark:text-neutral-800 hover:bg-emerald-700 dark:hover:bg-emerald-500 cursor-pointer"
      >
        <span className="font-semibold text-md">
          {selected ? selected.label : label || "Post A Job"}
        </span>
        <span className="text-xl">▾</span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={menuRef}
          className={`absolute mt-2 w-56 bg-white shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-2 z-20 animate-fadeIn ${
            dropdownPosition === "left" ? "left-0" : "right-0"
          }`}
        >
          {options.map((opt) => (
            <Button
              variant="text"
              key={opt.value}
              title={opt.tooltip}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
                opt.action?.();
              }}
              className={`flex justify-start w-full px-4 py-2 rounded-lg hover:bg-emerald-100 transition cursor-pointer ${
                selected?.value === opt.value ? "bg-emerald-100" : ""
              }`}
            >
              {opt.label}
            </Button>
          ))}

          {showViewAll && (
            <div className="flex justify-end">
              <Button variant="text" className="rounded-full">
                View all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
