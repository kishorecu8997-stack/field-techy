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
  designation: string;
  employer: string;
  workLocationType: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  educationLevel?: string;
  course?: string;
  university?: string;
  majorSubject?: string;
  passingYear?: number;
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
  jobSkills?: string[];
  tools?: string[];
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
  createdAt: string;
}

export type DocumentType =
  | "RESUME"
  | "GOVERNMENT_ID"
  | "CERTIFICATE"
  | "PICTURE"
  | "PROPOSAL"
  | "WORK_SCREEN_SHOT"
  | "PROFILE_PICTURE";

export interface Metadata {
  id?: string;
  engineerJobId?: string;
  activityDate?: string;
  remarks: string | null;
  workScreenshotId?: string;
}

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

export interface ScreenUploadParams {
  engineerId: string;
  file: File | null;
  documentType: DocumentType;
  metadata: Metadata;
}

export interface ScreenUploadResponse {
  id: string;
  engineerJobId: string;
  activityDate: string;
  remarks: string;
  workScreenshotId: string;
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
  engagementModel: string;
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
