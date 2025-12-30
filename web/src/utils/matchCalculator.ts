/**
 * Calculates a match score percentage between job requirements and a user's profile items.
 * 
 * The function performs a case-insensitive exact match comparison:
 * - Each job requirement is checked against the user's profile items.
 * - If a job requirement (normalized to lowercase) exactly matches any user profile item (also normalized),
 *   it is counted as a match.
 * - The final score is the percentage of job requirements that have a matching item in the user's profile,
 *   rounded to the nearest integer.
 * 
 * @param jobRequirements - An array of strings representing the required skills, qualifications, or items for the job.
 *                          Defaults to an empty array.
 * @param userProfileItems - An array of strings representing the user's skills, qualifications, or items.
 *                           Defaults to an empty array.
 * 
 * @returns A number between 0 and 100 representing the match percentage.
 *          Returns 0 if there are no job requirements.
 * 
 * @example
 * ```ts
 * const score = calculateMatchScore(
 *   ["JavaScript", "React", "Node.js"],
 *   ["javascript", "react", "typescript"]
 * );
 * console.log(score); // 67 (2 out of 3 requirements matched)
 * ```
 * Calculates the match score percentage between job requirements (skills/tools)
 * and a user's profile items (skills/tools).
 *
 * The score represents how many of the job's required items are present in the user's profile.
 * Comparison is case-insensitive and exact-match only.
 *
 * @param {string[]} [jobRequirements=[]] - Array of required skills/tools from the job posting.
 * @param {string[]} [userProfileItems=[]] - Array of skills/tools from the user's profile.
 *
 * @returns {number} The match score as a percentage (0 to 100), rounded to the nearest integer.
 *                   Returns 0 if there are no job requirements.
 *
 * @example
 * // Returns 75
 * calculateMatchScore(["React", "TypeScript", "Node.js"], ["react", "typescript", "graphql"]);
 *
 * @example
 * // Returns 100
 * calculateMatchScore(["JavaScript", "CSS"], ["javascript", "css", "html"]);
 *
 * @example
 * // Returns 0
 * calculateMatchScore([], ["React", "Vue"]);
 */
export const calculateMatchScore = (
  jobRequirements: string[] = [],
  userProfileItems: string[] = []
): number => {
  if (jobRequirements.length === 0) return 0;

  // Convert user items to lowercase for case-insensitive comparison
  const userItemsSet = new Set(userProfileItems.map((i) => i.toLowerCase()));
  const matchedItems = jobRequirements.filter((item) =>
    userItemsSet.has(item.toLowerCase())
  );
  const score = (matchedItems.length / jobRequirements.length) * 100;
  return Math.round(score);
};
