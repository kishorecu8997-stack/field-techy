import { menuItems } from "@/config/adminMenuItems";
import { useEffect, useState } from "react";
import { HiChevronDown, HiOutlineLogout } from "react-icons/hi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { SidebarProps } from "./types";
import { toast } from "react-toastify";
import { absoluteUrls } from "@/config/urls";
import { usePopupStore } from "@/shared/store/popupStore";

/**
 * Sidebar
 *
 * Admin dashboard navigation sidebar component with collapsible menu items.
 * Supports nested menu structure with expandable/collapsible sections and
 * active state highlighting.
 *
 * Features:
 * - Collapsible sidebar with icon-only and full-width states
 * - Nested menu structure with expandable parent items
 * - Automatic expansion of parent items based on active route
 * - Active route highlighting
 * - Logout functionality
 *
 * @param {SidebarProps} props - Component props
 * @param {boolean} props.isCollapsed - Controls the sidebar's collapsed state
 * @returns {JSX.Element} Sidebar navigation component
 */
export default function Sidebar({ isCollapsed }: SidebarProps) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const { showPopup } = usePopupStore();

  //Delete confirmation
  const handleLogout = async () => {
    await showPopup({
      title: "Logout",
      body: "Are you sure you want to logout?",
      actionButtons: [
        {
          label: "Cancel",
          value: null,
          variant: "outline",
        },
        {
          label: "Yes",
          value: "yes",
          variant: "danger",
          action: async (close) => {
            navigate(absoluteUrls.admin.auth.login);
            toast.success("Logged out successfully!");
            close(true);
          },
        },
      ],
    });
  };

  // Auto-expand if any child is active
  useEffect(() => {
    const newOpen = { ...openMenus };
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        newOpen[item.name] = true;
      }
    });
    setOpenMenus(newOpen);
  }, [location.pathname]);

  const toggle = (name: string) => {
    // setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    setOpenMenus((prev) => {
      const isCurrentlyOpen = prev[name];

      // New state: CLOSE ALL, then open only the clicked one (if not already open)
      const newState: Record<string, boolean> = {};

      if (!isCurrentlyOpen) {
        newState[name] = true;
      }
      return newState;
    });
  };

  return (
    <div
      className={`text-white flex flex-col transition-all text-sm duration-300 ease-out space-y-1 ${
        isCollapsed ? "w-16" : "w-64"
      } p-3`}
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      {menuItems.map((item) => {
        const hasChildren = !!item.children;
        const isExpanded = openMenus[item.name];

        if (hasChildren) {
          return (
            <div key={item.name} className="w-full">
              <div
                onClick={() => toggle(item.name)}
                className={`flex items-center cursor-pointer justify-between w-full py-2 rounded-lg hover:bg-white/10 transition-colors ${
                  isCollapsed ? "justify-center pl-0" : "px-3"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && (
                  <HiChevronDown
                    className={`transition-transform text-xl ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Submenu Items */}
              {!isCollapsed && isExpanded && (
                <div className="mt-1 space-y-1 ml-6">
                  {item.children?.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path!}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg ${
                          isActive
                            ? "bg-[#ffffff] text-gray-800 font-medium"
                            : "text-white hover:bg-white/10"
                        }`
                      }
                    >
                      <span>{child.icon}</span>
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Regular item (no children)
        return (
          <NavLink
            key={item.path}
            to={item.path!}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-white text-gray-800 font-medium"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <span>{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        );
      })}

      <div className="absolute bottom-0 w-58 mb-2">
        <div
          onClick={handleLogout}
          className={`flex cursor-pointer items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors mt-auto ${
            isCollapsed ? "justify-center px-2 w-fit" : "w-58"
          }`}
          aria-label="Logout"
        >
          <HiOutlineLogout className="text-lg" />
          {!isCollapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
}
