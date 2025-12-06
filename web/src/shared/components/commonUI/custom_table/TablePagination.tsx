import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface TablePaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * Pagination component for tables with navigation and optional page size selector.
 *
 * @param {number} total - Total number of records.
 * @param {number} pageSize - Number of records per page.
 * @param {number} currentPage - Current active page.
 * @param {(page: number) => void} onPageChange - Handles page change.
 * @param {(size: number) => void} [onPageSizeChange] - Handles page size change.
 * @returns {JSX.Element} Pagination UI with controls.
 */
const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize)); // at least 1
  const pageSizeOptions = [10, 25, 50];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-3 px-4 text-sm text-gray-600 dark:text-gray-200">
      <div className="text-center md:text-left">
        <span>
          Showing {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, total)} of {total} entries
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-1 py-1 text-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-40"
          >
            <MdKeyboardDoubleArrowLeft />
          </button>

          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-40"
          >
            <IoIosArrowBack />
          </button>

          <span className="px-3 py-1 rounded-full  border border-green-300 bg-green-50 text-green-700 font-semibold dark:bg-green-700 dark:text-white">
            {currentPage}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-40"
          >
            <IoIosArrowForward />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-1 py-1 text-gray-500 text-xl hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-40"
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>

        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default TablePagination;
