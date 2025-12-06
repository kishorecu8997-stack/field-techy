import { useState, useRef, useEffect } from "react";

/**
 * JobDetailsMenuButton Component
 * Renders a button that opens a dropdown menu for job details actions.
 * @returns {JSX.Element} The rendered button component.    
 */
export default function JobDetailsMenuButton() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div
        onClick={toggleMenu}
        className="text-xl px-2 py-1 rounded hover:bg-gray-200"
      >
        ⋮
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 z-20">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            Hold the job
          </div>
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            Cancel the job
          </div>
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            Clone the job
          </div>
        </div>
      )}
    </div>
  );
}
