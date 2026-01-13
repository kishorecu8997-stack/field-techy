import { useState, useCallback } from "react";

/**
 * useToggleStatus
 *
 * Custom React hook for managing boolean toggle states keyed by string identifiers.
 * Useful for managing on/off states for multiple items in a list or table.
 */
const useToggleStatus = (initialState: Record<string, boolean> = {}) => {
  const [status, setStatus] = useState<Record<string, boolean>>(initialState);

  const toggle = useCallback((id: string | number) => {
    setStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const get = useCallback(
    (id: string | number): boolean => {
      return !!status[id]; // returns false if undefined
    },
    [status],
  );

  return {
    status, // optional: expose if needed
    get,
    toggle,
  };
};

export default useToggleStatus;
