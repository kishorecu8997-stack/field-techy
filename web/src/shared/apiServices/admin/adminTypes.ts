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

export interface UploadPayload {
  adminId: string;
  file: File;
  fileType: string;
}

export interface UploadFile {
  fileKey: string;
  adminId: string;
  file: File;
  fileType: string;
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
    percentage?: number;
  }) => void;
}
