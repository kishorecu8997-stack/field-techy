export type OfflineAction = {
  type: "UPDATE_JOB_STATUS";
  payload: {
    jobId: string;
    status: string;
  };
  timestamp: number;
};
// Add more action types here in future
