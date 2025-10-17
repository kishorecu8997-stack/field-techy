export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean | string;
  options: SelectOption[];
  isShowLabel?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
}
