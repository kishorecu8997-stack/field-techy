import { generatePageRange } from '@/shared/libs/utils';
import type { PaginationProps } from './types';

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageRange = generatePageRange(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-1 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={`px-3 py-1 rounded-md transition-colors ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pageRange.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={`${page}-${index}`}
            onClick={() => handlePageClick(page)}
            aria-label={`Go to page ${page}`}
            className={`px-3 py-1 rounded-md transition-colors min-w-[2rem] ${
              page === currentPage
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-1 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          > &#8230;
            {page}
          </span>
        )
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={`px-3 py-1 rounded-md transition-colors ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;