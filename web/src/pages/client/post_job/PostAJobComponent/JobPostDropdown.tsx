import { useEffect, useRef, useState } from "react";
import type { PostOption } from "./TalentSection";
import { Button } from "@/shared/components/commonUI/Buttons";

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
    "left"
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-teal-200 cursor-pointer rounded-full shadow hover:bg-teal-300 transition flex items-center gap-2"
      >
        <span className="font-semibold text-md">{selected ? selected.label : label ||"Post A Job"}</span>
        <span className="text-xl">▾</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          ref={menuRef}
          className={`absolute mt-2 w-56 bg-white shadow-lg rounded-xl p-2 z-20 animate-fadeIn ${
            dropdownPosition === "left" ? "left-0" : "right-0"
          }`}
        >
          {options.map((opt) => (
            <Button
              variant="text"
              key={opt.value}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
                opt.action?.();
              }}
              className={`block text-left w-full px-4 py-2 rounded-lg hover:bg-teal-100 transition cursor-pointer ${
                selected?.value === opt.value ? "bg-teal-100" : ""
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
