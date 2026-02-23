import { QueryClient } from "@tanstack/react-query";

/**
 * Helper function to refetch profile completion query
 * Used to update the engineer profile completion percentage/bar
 * after mutations (profile update, experience add/edit, education, skills, etc.)
 */
export const refetchProfileCompletion = async (queryClient: QueryClient) => {
  await queryClient.refetchQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] &&
      typeof query.queryKey[0] === "object" &&
      (query.queryKey[0] as { _id?: string })._id ===
        "engineerGetProfileCompletion",
  });
};
