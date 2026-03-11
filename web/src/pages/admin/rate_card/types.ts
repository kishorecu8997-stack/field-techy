export interface PricingTier {
  level: string;
  description: string;
  hourly: number | "";
  daily: number | "";
  monthly: number | "";
}

export interface SkillPricing {
  id: string;
  name: string;
  tiers: PricingTier[];
  isEditing: boolean;
}

export interface InfoItem {
  label: string;
  value?: string | number | null;
}

export interface InfoGridProps {
  items: InfoItem[];
  columns?: number; // default = 3
  className?: string;
}

export interface RateCardProps {
  id: string;
  skillSet: string;
  region: string;
  location: string;
  experienceLevel: string;
  hourly: string;
  daily: string;
  monthly: string;
  project: string;
  createdDate: string;
  status: boolean;
  experienceLevels?: string[];
  country?: string;
  serviceCategoryId?: number;
  countryId?: number;
  experienceLevelRates?: {
    L1: { hourly: string; daily: string; monthly: string };
    L2: { hourly: string; daily: string; monthly: string };
    L3: { hourly: string; daily: string; monthly: string };
  };
}

export interface PricingFormValues {
  rateType?: string;
  country?: string;
  serviceCategory?: string;
  skills: SkillPricing[];
}

export type PricingRelations = {
  hourly?: number;
  daily?: number;
  monthly?: number;
};

export type PricingField = keyof PricingRelations;

// API Request/Response types
export interface CreateRateCardRate {
  [key: string]: number;
}

export interface CreateRateCardExperienceLevel {
  levelOrder: number;
  label: string;
  rates: CreateRateCardRate;
}

export interface CreateRateCardParams {
  countryId: number;
  serviceCategoryId: number;
  experienceLevels: CreateRateCardExperienceLevel[];
}

export interface CreateRateCardResponse {
  message: string;
  id?: number;
}

export interface RateCardParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RateCardRate {
  modelName: string;
  rate: string;
  engagementModelId: number;
}

export interface RateCardDataItem {
  id: number;
  serviceCategory: string;
  region: string;
  country: string;
  experienceLevels: string[];
  rates: RateCardRate[];
  createdDate: string;
  serviceCategoryId: number;
  countryId: number;
  experienceLevelId: number;
}

export interface RateCardsResponse {
  data: RateCardDataItem[];
  total: number;
  page: number;
  limit: number;
}
