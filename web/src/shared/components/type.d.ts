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
  width?: string;  
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
  onTabChange?: (activeTab: string) => void;
}

//Notification popover
export interface NotificationDropdownProps {
  title?: string;
  seeAllLink?: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

//chart
export interface SeriesConfig {
  dataKey: string;
  name: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  dot?: boolean | { r: number };
  activeDot?: boolean | { r: number };
}
export interface LegendConfig {
  verticalAlign?: "top" | "bottom" | "middle";
  align?: "left" | "center" | "right";
  wrapperStyle?: React.CSSProperties;
}

export interface GeneralChartProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  data: T[];
  chartType: ChartType;
  xAxisDataKey: keyof T;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  aspectRatio?: number;
  yAxisDomain?: [
    number | "auto" | "dataMin" | "dataMax",
    number | "auto" | "dataMin" | "dataMax"
  ];
  customTooltip?: React.ComponentType<TooltipProps<number, string>>;
  className?: string;
  series: SeriesConfig[];
  legend?: LegendConfig;
}

export type ChartType = "line" | "bar";