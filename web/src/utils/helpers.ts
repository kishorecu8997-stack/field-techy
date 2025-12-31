export const getStatusBadge = (status?: string) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "Completed") colorClass = "bg-green-100 text-green-800";
  else if (status === "Pending") colorClass = "bg-yellow-100 text-yellow-800";
  else if (status === "Approved") colorClass = "bg-blue-100 text-blue-800";
  else if (status === "Failed") colorClass = "bg-red-100 text-red-800";
  return colorClass;
};
