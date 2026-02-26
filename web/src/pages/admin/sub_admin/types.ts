export interface SubAdminFormBase {
  name: string;
  email: string;
  phoneNumber: string;
  region: string;
}

export interface AddSubAdminForm extends SubAdminFormBase {
  password: string;     
}

export interface EditSubAdminForm extends SubAdminFormBase {
 
}