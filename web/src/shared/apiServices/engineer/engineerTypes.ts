export interface JobSkill {
  id?: string;
  skillName: string;
}

export interface Tool {
  id?: string;
  toolName: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
}

export interface EngineerData {
  id?: string;
  password?: string;
  phoneNumber?: string;
  email?: string;
  fullName?: string;
  address?: string;
  portfolioLink?: string;
  serviceCategory?: string;
  budget?: string;
  rate?: number;
  experienceYears?: number;
  preferredWorkType?: string;
  enableNotifications?: boolean;
  location?: string;
  averageRating?: number;
  resume?: string | null;
  governmentIdProofDocument?: string | null;
  certificationQualificationsDocument?: string | null;
  profilePicture?: string | null;
  isApproved?: boolean | null;
  status?: string;
  traceId?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  isDeleted?: boolean;
  jobSkills?: JobSkill[];
  tools?: Tool[];
  experiences?: Experience[];
  educations?: Education[];
  files?: any;
}

export interface Sort {
  direction: "ASC" | "DESC";
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort[];
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface EngineerPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

export interface EngineerFile {
  id: string;
  engineerId: string;
  fileKey: string;
  fileType: DocumentType;
  fileName: string;
  mimeType: string;
  size: number;
  proposalId: string | null;
}

export type DocumentType =
  | "RESUME"
  | "GOVERNMENT_ID"
  | "CERTIFICATE"
  | "PICTURE"
  | "PROPOSAL";

export interface FileUploadParams {
  engineerId: string;
  file: File;
  documentType: DocumentType;
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
    percentage?: number;
  }) => void;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface JobAssignment {
  id: string;
  engineerId: string;
  jobId: string;
  status: string;
}

export interface AssignJobParams {
  engineerId: string;
  jobId: string;
  status: string;
}

export interface UpdatePasswordParams {
  phoneOrEmail: string;
  oldPassword: string;
  newPassword: string;
}

export interface ProposalJobData {
  id?: string;
  engineerId: string;
  proposalDescription: string;
  expectedPay: string;
  payType: string;
  availability: string;
}

export interface UpdatePasswordParams {
  email: string;
  password: string;
  otp: string;
}

