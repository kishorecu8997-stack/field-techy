export const getMdGridColsClass = (cols: number) => {
  const map: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  return map[cols] ?? "md:grid-cols-3"; // default
};