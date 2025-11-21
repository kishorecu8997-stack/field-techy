import { Button } from "@/shared/components/commonUI/Buttons";
import React, { useState, useRef, useEffect } from "react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { TbClockHour4 } from "react-icons/tb";
import type { JobCardProps } from "../types";
import Popup from "@/shared/components/Popup";
import RequestRevision from "./RequestRevision";

/**
 * `JobCardDetailsHeader` is a component that displays a header for a job details card.
 * It shows the job title, hours, client name, and status.
 * It includes action buttons to approve work or request a revision, and a kebab menu for more options.
 *
 * @param {JobCardProps} props The properties for the component.
 * @param {string} props.title The title of the job.
 * @param {number} props.hours The total hours for the job.
 * @param {string} props.client The name of the client.
 * @param {'On Site' | 'Remote' | 'Pending'} props.status The current status of the job.
 * @param {() => void} props.onApprove A callback function triggered when the "Approve Work" button is clicked.
 * @param {() => void} props.onRequestRevision A callback function triggered when the "Request Revision" button is clicked.
 */
const JobCardDetailsHeader: React.FC<JobCardProps> = ({
  title,
  hours,
  client,
  status,
  onApprove,
  onRequestRevision,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuAction = (action: string) => {
    console.log(action); // Placeholder for action handling
    setIsMenuOpen(false);
  };

  const handleFormSubmit = (data: { notes: string; file?: File }) => {
    console.log("Form data:", data);
    // Handle submission logic here
    setIsOpen(false);
  };

  return (
    <div className="bg-emerald-900 dark:bg-emerald-800 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="flex items-center gap-2 text-sm mb-2 underline">
              <TbClockHour4 className="w-5 h-5" />
              <span>{hours} Hours of Jobs</span>
            </div>
            <p className="text-sm">
              Client: <span className="font-medium">{client}</span>
            </p>
          </div>

          <div className="flex items-center gap-2" ref={menuRef}>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "On Site"
                  ? "bg-white text-emerald-900"
                  : status === "Remote"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status}
            </span>
            <div className="relative">
              <IoEllipsisVerticalOutline
                className=" w-5 h-5 "
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 text-gray-800 dark:text-white">
                  <ul className="py-1">
                    {["Hold the job", "Cancel the job", "Clone the job"].map(
                      (item) => (
                        <li key={item}>
                          <button
                            onClick={() => handleMenuAction(item)}
                            className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {item}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="primary"
            onClick={onApprove}
            className="px-6 py-3 rounded-lg font-medium"
          >
            Approve Work
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsOpen(true)}      
            className="px-6 py-3  rounded-lg font-medium"
          >
            Request Revision
          </Button>
        </div>
      </div>
      <Popup open={isOpen} onClose={() => setIsOpen(false)}>
        <RequestRevision
          onClose={() => setIsOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Popup>
    </div>
  );
};

export default JobCardDetailsHeader;
