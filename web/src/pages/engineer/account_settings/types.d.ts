import type { bankList } from "@/dummy_data/bankDetails";

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

// types.ts

export interface AccordionItem {
  id: string | number;
  label: string;
  content: ReactNode;
  icon?: ReactNode; // Optional icon to show next to the label
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconPosition?: "left" | "right"; // Position of the chevron (not the label icon)
}

export interface ContactCardProps {
  items: ContactItem[];
  className?: string; // optional for extra styling flexibility
}

// Define types for menu items
export interface MenuItem {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  onClick?: () => void;
  disabled?: boolean;
}

// Props interface
export interface SettingsMenuProps {
  items: MenuItem[];
  className?: string;
  ariaLabel?: string;
}

// Toggle Switch Component
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export type BankKey = (typeof bankList)[number]["value"];

// Derive country code type from rules
export type CountryCode = keyof typeof IBAN_RULES;

export interface bankDetails {
  name: string;
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  swiftcode: string;
  iban: string;
}
