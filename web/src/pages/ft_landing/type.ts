export interface UserTypeOption {
  id: string;
  title: string;
  description: string;
}
export interface UserTypeDropdownProps {
  title?: string;
  selected: string | null;
  onSelect: (value: string) => void;
  options: UserTypeOption[];
  className?: string;
  onClose?: () => void;
}

export type ServiceOperationFormData = {
  fullName: string;
  email: string;
  company: string;
  country: string;
  city: string;
  message: string;
};
