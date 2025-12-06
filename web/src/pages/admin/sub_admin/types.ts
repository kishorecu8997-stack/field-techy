export interface PermissionListType {
  id: string;
  moduleName: string;
  addAndEdit: boolean;
  view: boolean;
  delete: boolean;
}


export interface RoleListType {
  id: string;
  roleName: string;
  status: boolean;
  permissionList?: PermissionListType[];
}

export interface AddSubAdminForm {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}