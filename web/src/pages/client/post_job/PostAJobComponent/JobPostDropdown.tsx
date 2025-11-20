import { useEffect, useRef, useState } from "react";
import type { PostOption } from "./TalentSection";

export default function JobPostDropdown({
  options,
}: {
  options: PostOption[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PostOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      className="relative inline-block text-left text-neutral-800"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-teal-200 cursor-pointer rounded-full shadow hover:bg-teal-300 transition flex items-center gap-2"
      >
        <span>{selected ? selected.label : "Post A Job"}</span>
        <span className="text-xl">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-xl p-2 z-20 animate-fadeIn">
          {options.map((opt) => (
            <button
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
