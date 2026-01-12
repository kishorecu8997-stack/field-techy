import type { CSSProperties } from "react";

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

export const tourStyles = {
  maskArea: (base: CSSProperties & { rx?: number }) => ({
    ...base,
    rx: 10,
    overflow: "hidden",
  }),

  badge: (base: CSSProperties) => ({
    ...base,
    backgroundColor: "#005e59",
  }),
  controls: (base: CSSProperties) => ({
    ...base,
    marginTop: 12,
  }),
  dot: (base: CSSProperties, state?: { current?: boolean }) => ({
    ...base,
    backgroundColor: state?.current ? "#005e59" : "#e0e0e0",
  }),
};
