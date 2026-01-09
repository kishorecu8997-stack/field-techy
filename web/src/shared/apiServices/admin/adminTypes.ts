export type AdminData = {
  phoneOrEmail: string;
  password: string;
};

export interface getAdminByIdResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}
