export const JOB_TYPES = {
  onsite: "On site",
  remote: "Remote",
  hybrid: "Hybrid",
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export const JOB_TYPES_ARRAY = Object.entries(JOB_TYPES).map(
  ([key, value]) => ({
    label: value,
    value: key,
  }),
);
