import { TbCash, TbLayoutDashboard, TbLayoutGrid } from "react-icons/tb";
import { absoluteUrls } from "./urls";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsPersonGear, BsPersonWorkspace, BsSuitcaseLg } from "react-icons/bs";
import { RxBackpack } from "react-icons/rx";
import { LuSettings, LuSettings2, LuWallet } from "react-icons/lu";
import { RiBankCardLine, RiErrorWarningLine } from "react-icons/ri";
import { BiFile } from "react-icons/bi";
import { ImLoop } from "react-icons/im";

/**
 * Represents a single item in the admin navigation menu.
 * Can be either a direct link or a parent item with nested children.
 *
 * @interface MenuItem
 * @property {string} name - Display name of the menu item
 * @property {string} path - URL path or route for the menu item
 * @property {React.ReactNode} [icon] - Optional icon component to display next to the name
 * @property {MenuItem[]} [children] - Optional array of nested menu items for dropdowns
 */
export interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

/**
 * Configuration array defining the admin dashboard's navigation structure.
 * Contains all available menu items for the admin sidebar navigation.
 *
 * Menu structure includes:
 * - Dashboard overview
 * - User management (Engineers, Clients, Sub-Admins)
 * - Content management (Jobs, Categories, CMS)
 * - Financial tools (Payments, Transactions, Rate Cards)
 * - System features (Notifications, Settings)
 *
 * Icons are imported from various icon libraries (react-icons) and
 * paths are defined in the absoluteUrls configuration.
 */
export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: absoluteUrls.admin.home.dashboard,
    icon: <TbLayoutDashboard className="text-lg" />,
  },
  {
    name: "People",
    path: "people",
    icon: <HiOutlineUserGroup className="text-lg" />,
    children: [
      {
        name: "Engineers",
        path: absoluteUrls.admin.home.manage_engineer,
        icon: <BsPersonWorkspace className="text-lg" />,
      },
      {
        name: "Clients",
        path: absoluteUrls.admin.home.manage_client,
        icon: <HiOutlineUserGroup className="text-lg" />,
      },
    ],
  },
  {
    name: "Jobs",
    path: "jobs",
    icon: <BsSuitcaseLg className="text-lg" />,
    children: [
      {
        name: "Service Category",
        path: absoluteUrls.admin.home.manage_categories,
        icon: <TbLayoutGrid className="text-lg" />,
      },
      {
        name: "Jobs",
        path: absoluteUrls.admin.home.manage_jobs,
        icon: <RxBackpack className="text-lg" />,
      },
    ],
  },
  {
    name: "Finance",
    path: "finance",
    icon: <TbCash className="text-xl" />,
    children: [
      {
        name: "Rate Card",
        path: absoluteUrls.admin.home.manage_rate_card,
        icon: <RiBankCardLine className="text-lg" />,
      },
      {
        name: "Exchange Rates",
        path: absoluteUrls.admin.home.manage_currency_conversion,
        icon: <ImLoop className="text-lg" />,
      },
    ],
  },

  {
    name: "Wallet",
    path: "wallet",
    icon: <LuWallet className="text-lg" />,
    children: [
      {
        name: "Wallet Overview",
        path: absoluteUrls.admin.home.wallet_overview,
        icon: <LuWallet className="text-lg" />,
      },
      {
        name: "Transaction Requests",
        path: absoluteUrls.admin.home.wallet_transaction_requests,
        icon: <RiBankCardLine className="text-lg" />,
      },
    ],
  },
  {
    name: "FT Settings",
    path: "settings",
    icon: <LuSettings2 className="text-lg" />,
    children: [
      {
        name: "Notification",
        path: absoluteUrls.admin.home.manage_notification,
        icon: <FaRegBell className="text-lg" />,
      },
      {
        name: "Sub Admins",
        path: absoluteUrls.admin.home.manage_sub_admin,
        icon: <BsPersonGear className="text-lg" />,
      },
      {
        name: "CMS",
        path: absoluteUrls.admin.home.manage_cms,
        icon: <BiFile className="text-lg" />,
      },
      {
        name: "Settings",
        path: absoluteUrls.admin.home.settings,
        icon: <LuSettings className="text-lg" />,
      },
    ],
  },
  {
    name: "Reported Issue",
    path: absoluteUrls.admin.home.report_issue,
    icon: <RiErrorWarningLine className="text-lg" />,
  },
];

//this is the sample line for testing the build
