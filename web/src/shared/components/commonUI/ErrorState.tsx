import { MdErrorOutline } from "react-icons/md";
import { Button } from "./Buttons";

interface ErrorStateProps {
  title?: string;
  message?: string;
  retryLabel?: string | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * A reusable, styled error-state card with an icon, title, message and an optional retry button.
 *
 * @example
 * <ErrorState
 *   title="Unable to Load Jobs"
 *   message="Something went wrong. Please try again later."
 *   onRetry={() => refetch()}
 * />
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something Went Wrong",
  message = "An unexpected error occurred. Please try again later.",
  retryLabel = "Retry",
  onRetry,
  className = "",
}) => {
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div className={`flex justify-center items-center py-16 ${className}`}>
      <div className="flex flex-col items-center gap-4 max-w-sm w-full border-2 border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 rounded-2xl p-10 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40">
          <MdErrorOutline className="w-9 h-9 text-red-500 dark:text-red-400" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>

        {retryLabel !== null && (
          <Button
            variant="no_style"
            onClick={handleRetry}
            className="mt-2 px-5 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
