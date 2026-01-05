import { useQuery } from "@tanstack/react-query";
import { UserAdapter } from "./userAdapter";

export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  exists: (emailOrPhone: string) =>
    [...USER_QUERY_KEYS.all, "exists", emailOrPhone] as const,
};

/**
 * Hook to check if a user exists by email or phone number
 *
 * Endpoint: GET /api/v1/users/exists/<encoded_email_or_phone>
 * The <encoded_email_or_phone> is the slug parameter in the URL path.
 *
 * React Query automatically cancels previous requests when the query key changes,
 * so we don't need to manually handle cancellation. The signal from the query context
 * is automatically passed to axios.
 *
 * @param emailOrPhone - The email address or phone number to check
 * @param options - Query options including enabled flag
 * @returns Query result with user exists response
 */
export function useUserExists(
  emailOrPhone: string | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.exists(emailOrPhone || ""),
    queryFn: async ({ signal }) => {
      // React Query provides the AbortSignal automatically
      // When the query key changes, React Query cancels the previous request
      return await UserAdapter.exists(emailOrPhone!, signal);
    },
    enabled: !!emailOrPhone && (options?.enabled ?? true),
    retry: false, // Don't retry on failure for existence checks
  });
}
