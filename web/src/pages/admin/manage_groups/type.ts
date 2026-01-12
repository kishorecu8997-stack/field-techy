export interface ManageGroups {
  srNo: number;
  groupName: string;
  groupDescription: string;
  noOfEngineers: number;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  status: boolean;
}

export interface AddGroup {
  groupName: string;
  groupDescription: string;
}
