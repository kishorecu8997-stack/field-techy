import { Component, type ErrorInfo, type ReactNode } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
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
 */
class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
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
            message={this.state.error?.message || "Something went wrong while rendering this page."}
            retryLabel="Reload Page"
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * RouteErrorBoundary is a functional component designed to be used as 
 * React Router's errorElement. It uses useRouteError to handle routing errors.
 */
export const RouteErrorBoundary = () => {
  const error = useRouteError();

  let title = "Application Error";
  let message = "Something went wrong while navigating or loading data.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <ErrorState
        title={title}
        message={message}
        retryLabel="Reload Page"
        onRetry={() => window.location.reload()}
      />
    </div>
  );
};

export default GlobalErrorBoundary;
