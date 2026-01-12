import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useUserExists } from "./userService";

/**
 * Hook to check if a user exists with debouncing
 *
 * This hook debounces the input and only makes API calls after the user
 * stops typing for a specified delay. It also handles cancellation of
 * previous requests when new input is provided.
 *
 * @param emailOrPhone - The email address or phone number to check
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 * @param options - Additional options including enabled flag
 * @returns Object containing debounced value, query result, and validation state
 */
export function useDebouncedUserExists(
  emailOrPhone: string | undefined,
  debounceMs: number = 500,
  options?: { enabled?: boolean },
) {
  const [debouncedValue, setDebouncedValue] = useState<string | undefined>(
    emailOrPhone,
  );
  const debounceRef = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    // Create debounced function if it doesn't exist
    if (!debounceRef.current) {
      debounceRef.current = debounce((value: string | undefined) => {
        setDebouncedValue(value);
      }, debounceMs);
    }

    // Call debounced function
    debounceRef.current(emailOrPhone);

    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    };
  }, [emailOrPhone, debounceMs]);

  // Only query if debounced value is valid (not empty, has minimum length)
  const isValidForQuery = debouncedValue && debouncedValue.trim().length > 0;
  const queryResult = useUserExists(
    isValidForQuery ? debouncedValue : undefined,
    { enabled: !!(isValidForQuery && (options?.enabled ?? true)) },
  );

  // Determine validation state
  // Available: status 200 with detail "Available"
  // Unavailable: status 409 with detail "Already in use."
  const isAvailable =
    queryResult.data?.status === 200 &&
    queryResult.data?.detail === "Available";
  const isUnavailable =
    (queryResult.data?.status === 409 &&
      queryResult.data?.detail === "Already in use.") ||
    (queryResult.data?.status === 200 &&
      queryResult.data?.detail !== "Available" &&
      queryResult.isSuccess);
  const isValidating = queryResult.isFetching;
  const hasError = queryResult.isError && !isUnavailable; // Don't treat 409 as an error

  return {
    ...queryResult,
    debouncedValue,
    isAvailable,
    isUnavailable,
    isValidating,
    hasError,
    error: queryResult.error,
  };
}
