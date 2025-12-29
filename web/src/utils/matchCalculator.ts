export const calculateMatchScore = (
  jobRequirements: string[] = [],
  userProfileItems: string[] = []
): number => {
  if (jobRequirements.length === 0) return 0;

  // Convert to lowercase for case-insensitive comparison
  const userItemsSet = new Set(userProfileItems.map((i) => i.toLowerCase()));

  const matchedItems = jobRequirements.filter((item) =>
    userItemsSet.has(item.toLowerCase())
  );

  const score = (matchedItems.length / jobRequirements.length) * 100;
  return Math.round(score);
};
