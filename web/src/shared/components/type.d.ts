/**
 * @file Centralized type definitions for shared, reusable UI components.
 *
 * This file contains TypeScript interfaces and types for common components
 * used throughout the application, such as popups, maps, navigation, and tabs.
 */

/**
 * Defines the props for the `Breadcrumb` component.
 */
interface BreadcrumbProps {
  homeLabel?: string;
  customLabels?: Record<string, string>;
}

/**
 * Defines the props for the `Drawer` (side navigation) component.
 */
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Represents a single marker to be displayed on a map.
 */
export interface MapMarker {
  id?: string | number;
  position: [number, number]; // [lat, lng]
  title?: string;
  description?: string;
}

/**
 * Defines the props for a generic `MapComponent`.
 */
interface MapComponentProps {
  initialPosition?: [number, number];
  initialZoom?: number;
  markers?: MapMarker[];
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

/**
 * Defines the props for the main application `Navbar`.
 */
interface NavbarProps {
  onDrawerToggle: () => void;
  isDrawerOpen: boolean;
}

/**
 * Defines the props for the generic `Popup` modal component.
 */
type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  inputClassName?: string;
};

/**
 * Defines the props for a `SortDropdown` component.
 */
interface SortDropdownProps {
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

/**
 * Represents a single tab within a `TabComponent`.
 */
interface TabItem {
  label: string;
  content: React.ReactNode;
  hide?: boolean; // Optional: if true, tab won't be rendered
}

/**
 * Defines the props for a `TabComponent` that manages a set of tabs.
 */
interface TabComponentProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
}
export interface Category {
  id: string;
  items: string;
}
interface CategoryTagProps {
  category: Category[]; 
  label?: string;  
  isShowLabel?: boolean;
  required?: boolean;
}

interface InformationCardProps {
  title: string;
  description: string;
  details: {
    label: string;
    value: string;
  }[];
  className?: string;
}

interface InformationCardPropsTools {
  title: string;
  description: string;
  category: string[]; 
  className?: string;
}


interface PaymentMethodSelectorProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  isShowRadio?: boolean;
  required?: boolean;
  rules?: RegisterOptions;
  options?: PaymentCardOption[];
  onAddNew?: (cardData: CardFormData) => void;
  isOpen?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}