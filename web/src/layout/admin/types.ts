export interface SidebarProps {
  isCollapsed: boolean;
}

export interface NavbarProps {
  onToggleSidebar: () => void;
}

export const notifications = [
  {
    name: "Alex Morgan",
    message: "Lorem ipsum dolor sit amet",
    timestamp: "2 hours ago",
  },
  {
    name: "Taylor Kim",
    message: "Lorem ipsum dolor sit amet",
    timestamp: "5 hours ago",
  },
  {
    name: "Jordan Patel",
    message: "Lorem ipsum dolor sit amet",
    timestamp: "Yesterday",
  },
];
