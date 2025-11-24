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