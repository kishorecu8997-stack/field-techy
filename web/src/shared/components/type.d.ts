interface BreadcrumbProps {
  homeLabel?: string;
  customLabels?: Record<string, string>;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MapMarker {
  id?: string | number;
  position: [number, number]; // [lat, lng]
  title?: string;
  description?: string;
}

interface MapComponentProps {
  initialPosition?: [number, number];
  initialZoom?: number;
  markers?: MapMarker[];
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

interface NavbarProps {
  onDrawerToggle: () => void;
  isDrawerOpen: boolean;
}

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

interface SortDropdownProps {
  currentSort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

interface TabItem {
  label: string;
  content: React.ReactNode;
  hide?: boolean; // Optional: if true, tab won't be rendered
}

interface TabComponentProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
}
