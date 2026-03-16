export const getStatusBadge = (status?: string) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "Completed") colorClass = "bg-green-100 text-green-800";
  else if (status === "Pending") colorClass = "bg-yellow-100 text-yellow-800";
  else if (status === "Approved") colorClass = "bg-blue-100 text-blue-800";
  else if (status === "Failed") colorClass = "bg-red-100 text-red-800";
  return colorClass;
};

export const getLevelColor = (level?: string) => {
  let colorClass = "bg-gray-300"; // Default

  if (level === "low") colorClass = "bg-amber-300";
  else if (level === "medium") colorClass = "bg-orange-500";
  else if (level === "high") colorClass = "bg-red-500";
  else if (level === "critical") colorClass = "bg-red-600";

  return colorClass;
};

export const formatRating = (rating: string | number): string => {
  const num = parseFloat(String(rating));
  return isNaN(num)
    ? String(rating)
    : num % 1 === 0
      ? String(num)
      : `${Math.floor(num)}+`;
};
