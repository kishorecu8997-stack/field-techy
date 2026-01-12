// hooks/useHeaderTitle.ts
import { useEffect } from "react";

export interface HeaderTitleEventDetail {
  title: string;
  navigateTo?: string;
}

// Define the custom event type for better type safety
declare global {
  interface WindowEventMap {
    "header-title-change": CustomEvent<HeaderTitleEventDetail>;
  }
}

// Type-safe event dispatcher
const dispatchHeaderTitleChange = (title: string) => {
  const event = new CustomEvent<HeaderTitleEventDetail>("header-title-change", {
    detail: { title },
  });
  window.dispatchEvent(event);
};

export const useHeaderTitle = (title: string) => {
  useEffect(() => {
    // Dispatch when component mounts or title changes
    dispatchHeaderTitleChange(title);

    // Cleanup on unmount — reset title
    return () => {
      dispatchHeaderTitleChange("");
    };
  }, [title]);
};
