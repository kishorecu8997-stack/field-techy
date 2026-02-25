export type EngineerAssignment = {
  assignmentId: number;
  jobId: number;
  assignmentStatus: string;
  jobStatus: string;
  assignmentType: string;
  proposalDetail: string;
  appliedAt: string | null;
  engineer?: {
    name?: string;
    email?: string;
    city?: string;
    state?: string;
  };
};