import React from "react";

/**
 * Pagination component for navigating through pages
 *
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback function when page changes
 * @returns {JSX.Element} Rendered pagination component
 */
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  /**
   * Generate page numbers to display
   * @returns {number[]} Array of page numbers to display
   */
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      // Show all pages if total pages is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and adjacent pages
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1); // Ellipsis
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {"<"}
      </button>

      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-1 text-gray-700 dark:text-white"
          >
            ...
          </span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-white dark:bg-gray-800 border-2 border-green-700 dark:border-green-500 text-green-700 dark:text-green-500 font-medium"
                : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
