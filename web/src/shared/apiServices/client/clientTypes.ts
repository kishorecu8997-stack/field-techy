export interface ClientData {
    id?: string | null;
    phoneNumber?: string;
    email?: string;
    password?: string | null;
    clientType?: string;
    companyName?: string;
    contactPersonName?: string;
    businessType?: string;
    industry?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    taxDocumentVat?: string;
    vatRegistrationNumber?: string;
    profilePicture?: string | null;
    governmentIdProofDocument?: string | null;
    certificationQualificationsDocument?: string | null;
    enableNotifications?: boolean;
    isApproved?: boolean;
    vat?: string;
    fullName?: string;
    confirmPassword?: string;
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

export interface ClientPaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}

export interface ClientFile {
    id: string;
    clientId: string;
    fileKey: string;
    fileType: ClientDocumentType;
    fileName: string;
    mimeType: string;
    size: number;
    traceId: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    deletedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isDeleted: boolean;
}

export type ClientDocumentType = "GOVERNMENT_ID" | "PROFILE_PICTURE" | "CERTIFICATE";

export interface ClientFileUploadParams {
    clientId: string;
    file: File;
    documentType: ClientDocumentType;
    onUploadProgress?: (progressEvent: { loaded: number; total?: number; percentage?: number }) => void;
}

export interface FileUploadResponse {
    fileId: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
}

export interface FileDownloadResponse {
    blob: Blob;
    fileName: string;
    mimeType: string;
    size: number;
    contentDisposition?: string;
    contentLength?: number;
}
