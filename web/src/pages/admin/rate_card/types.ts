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
  rate: string;
  rateType: string;
  project: string;
  createdDate: string;
  status: boolean;
}

export interface PricingFormValues {
  skills: SkillPricing[];
}
