import { useRef, useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdBlockFlipped, MdPauseCircleOutline } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useClickOutside } from "@/shared/components/UseclickOutside";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";
import type { ManageEngineerProps } from "../types";

interface Props {
  row: ManageEngineerProps;
  showAction: number | null;
  setShowAction: (v: number | null) => void;
  handleDelete: (row: ManageEngineerProps) => void;
  setIsSuspend: (v: boolean) => void;
  setIsBlock: (v: boolean) => void;
}

/**
 * ActionsMenu Component
 *
 * Displays a dropdown menu for managing engineers, including:
 * - View Details
 * - Edit Details
 * - Suspend/Block Job
 * - Delete Job
 * @returns {JSX.Element} The rendered ActionsMenu component.
 */
export default function ActionsMenu({
  row,
  showAction,
  setShowAction,
  handleDelete,
  setIsSuspend,
  setIsBlock,
}: Props) {
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [, setOpenDirection] = useState<"up" | "down">("down");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useClickOutside(dropdownRef, triggerRef, () => setShowAction(null));

  // Calculate dropdown position with right-edge awareness
  useEffect(() => {
    if (showAction === row.id && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const dropdownWidth = dropdownRef.current.offsetWidth;

      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Vertical direction
      let newDirection: "up" | "down" = "down";
      let topPosition = triggerRect.bottom;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        newDirection = "up";
        topPosition = triggerRect.top - dropdownHeight;
      }

      let leftPosition = triggerRect.left;

      const margin = 50;
      if (triggerRect.left + dropdownWidth + margin > window.innerWidth) {
        leftPosition = window.innerWidth - dropdownWidth - margin;
        leftPosition = Math.max(margin, leftPosition);
      }

      setOpenDirection(newDirection);
      setDropdownPosition({
        top: topPosition,
        left: leftPosition,
      });
    }
  }, [showAction, row.id]);

  const openModalThenCloseDropdown = (openFn: () => void) => {
    openFn();
    setTimeout(() => setShowAction(null), 0);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={showAction === row.id ? triggerRef : null}
        onClick={(e) => {
          e.stopPropagation();
          setShowAction(showAction === row.id ? null : row.id);
        }}
        className="text-center text-lg cursor-pointer"
      >
        <HiOutlineDotsHorizontal />
      </div>

      {showAction === row.id && (
        <div
          ref={dropdownRef}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 50,
          }}
          className="w-fit min-w-max py-2 rounded-lg shadow-lg bg-white dark:bg-gray-700"
        >
          <div
            onClick={() => {
              setShowAction(null);
              navigate(absoluteUrls.admin.home.manage_engineer_view);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <FiEye className="text-yellow-600" />
            <span>View</span>
          </div>

          <div
            onClick={() => {
              setShowAction(null);
              navigate(
                `${absoluteUrls.admin.home.manage_engineer_edit}/${row.id}`
              );
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <CiEdit className="text-blue-600" />
            <span>Edit</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              openModalThenCloseDropdown(() => setIsSuspend(true));
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <MdPauseCircleOutline className="text-gray-300" />
            <span>Suspend</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              openModalThenCloseDropdown(() => setIsBlock(true));
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <MdBlockFlipped className="text-gray-300" />
            <span>Block</span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              openModalThenCloseDropdown(() => handleDelete(row));
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <RiDeleteBin6Line className="text-red-600" />
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
}
