import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorState from "./ErrorState";

interface Props {
  children?: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * GlobalErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * Note: Error boundaries do NOT catch errors for event handlers, asynchronous code,
 * or server-side rendering.
 */
class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  /**
   * Updates state so the next render will show the fallback UI
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Used to log the error to an error reporting service
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
    // You could also log to an external service like Sentry or LogRocket here
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <ErrorState
            title="Application Error"
            message="Something went wrong while rendering the page. Our team has been notified."
            retryLabel="Reload Page"
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
