export interface PricingTier {
  level: string;
  description: string;
  hourly: number | "";
  halfDay: number | "";
  fullDay: number | "";
  weekly: number | "";
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
  halfDay: string;
  fullDay: string;
  weekly: string;
  monthly: string;
  project: string;
  createdDate: string;
  status: boolean;
}

export interface PricingFormValues {
  rateType?: string;
  country?: string;
  serviceCategory?: string;
  skills: SkillPricing[];
}

export type PricingRelations = {
  hourly?: number;
  halfDay?: number;
  fullDay?: number;
  weekly?: number;
  monthly?: number;
};

export type PricingField = keyof PricingRelations;
