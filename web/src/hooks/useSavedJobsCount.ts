import { useState, useEffect } from "react";
import { getSavedJobs, BOOKMARK_CHANGE_EVENT } from "@/utils/bookmarkUtils";

/**
 * Custom hook that returns the current number of saved jobs.
 * Automatically updates in real-time when jobs are saved or unsaved.
 */
export const useSavedJobsCount = (): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setCount(getSavedJobs().length);
    };

    updateCount();

    window.addEventListener(BOOKMARK_CHANGE_EVENT, updateCount);

    return () => {
      window.removeEventListener(BOOKMARK_CHANGE_EVENT, updateCount);
    };
  }, []);

  return count;
};
