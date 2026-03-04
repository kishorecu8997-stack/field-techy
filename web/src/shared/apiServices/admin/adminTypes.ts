export interface CreateNotificationParams {
  title: string;
  message: string;
  type: string;
  sendTo: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  sendTo: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UpdateNotificationParams {
  id: string;
  title: string;
  message: string;
  type: AdminNotification["type"];
  sendTo: AdminNotification["sendTo"];
}
export interface PagedNotificationsParams {
  page: number;
  size: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

export interface PagedNotificationsResponse {
  content: AdminNotification[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
export type AdminData = {
  phoneOrEmail: string;
  password: string;
};
export interface CreateNotificationParams {
  title: string;
  message: string;
  type: string;
  sendTo: string;
}
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  sendTo: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UpdateNotificationParams {
  id: string;
  title: string;
  message: string;
  type: string;
  sendTo: string;
}

export interface AdminByIdResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}
export interface UploadFile {
  // fileKey: string;
  adminId: string;
  file: File;
  fileType: string;
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
    percentage?: number;
  }) => void;
}

export interface RateCardItem {
  id: number;
  skillSet: string;
  region: string;
  location: string;
  rate: string;
  rateType: string;
  createdAt: string;
  lastUpdated: string | null;
  lastUpdatedBy: string | null;
  countryId: number;
  serviceCategoryId: number;
  experienceLevelId: number;
  engagementModelId: number;
}

// New API response types
export interface RateCardDataItem {
  id: number;
  serviceCategory: string;
  region: string;
  country: string;
  experienceLevels: string[];
  hourly: string;
  halfDay: string;
  fullDay: string;
  weekly: string;
  monthly: string;
  createdDate: string;
  serviceCategoryId: number;
  countryId: number;
}

export interface RateCardsResponse {
  data: RateCardDataItem[];
  total: number;
  page: number;
  limit: number;
}

export interface RateCardParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RateCardSkill {
  serviceCategoryId: number;
  experienceLevelId: number;
  rate: number;
}

// New API structure types
export interface ExperienceLevelRate {
  hourly: number;
  halfDay4h: number;
  fullDay8h: number;
  weekly5d: number;
  monthly: number;
}

export interface ExperienceLevel {
  levelOrder: number;
  label: string;
  rates: ExperienceLevelRate;
}

export interface CreateRateCardParams {
  countryId: number;
  serviceCategoryId: number;
  experienceLevels: ExperienceLevel[];
}

// Old API structure (kept for backward compatibility)
export interface CreateRateCardParamsLegacy {
  countryId: number;
  engagementModelId: number;
  skills: RateCardSkill[];
}

export interface CreateRateCardResponse {
  message: string;
  id?: number;
}

export interface UpdateRateCardParams {
  rate: number;
}

export interface UpdateRateCardResponse {
  message: string;
}

export interface DeleteRateCardResponse {
  message: string;
}

// Service Categories Types
export interface ServiceCategoryItem {
  id: number;
  name: string;
}

export interface ServiceCategoriesResponse {
  data: ServiceCategoryItem[];
  total: number;
  page: number;
  limit: number;
}
