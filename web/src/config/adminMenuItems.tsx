import { TbLayoutDashboard, TbLayoutGrid } from "react-icons/tb";
import { absoluteUrls } from "./urls";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineCreditCard, HiOutlineUserGroup } from "react-icons/hi";
import { BsPersonGear, BsPersonWorkspace } from "react-icons/bs";
import { RxBackpack } from "react-icons/rx";
import { LuSettings, LuWallet } from "react-icons/lu";
import { RiBankCardLine } from "react-icons/ri";
import { BiFile } from "react-icons/bi";
import { MdCurrencyExchange } from "react-icons/md";

export interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: absoluteUrls.admin.home.dashbaord,
    icon: <TbLayoutDashboard className="text-lg" />,
  },
  {
    name: "Manage Engineer",
    path: absoluteUrls.admin.home.manage_engineer,
    icon: <BsPersonWorkspace className="text-lg" />,
  },
  {
    name: "Manage Clients",
    path: absoluteUrls.admin.home.manage_client,
    icon: <HiOutlineUserGroup className="text-lg" />,
  },
  {
    name: "Manage Job Category",
    path: absoluteUrls.admin.home.manage_categories,
    icon: <TbLayoutGrid className="text-lg" />,
  },
  {
    name: "Manage Jobs",
    path: absoluteUrls.admin.home.manage_jobs,
    icon: <RxBackpack className="text-lg" />,
  },
  {
    name: "Manage Rate Card",
    path: absoluteUrls.admin.home.manage_rate_card,
    icon: <RiBankCardLine className="text-lg" />,
  },
  {
    name: "Manage Payment",
    path: absoluteUrls.admin.home.manage_payment,
    icon: <HiOutlineCreditCard className="text-xl" />,
  },
  {
    name: "Manage Transactions",
    path: absoluteUrls.admin.home.manage_transactions,
    icon: <MdCurrencyExchange className="text-lg" />,
  },
  {
    name: "Wallet Transactions",
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
    name: "Manage Notification",
    path: absoluteUrls.admin.home.manage_notification,
    icon: <FaRegBell className="text-lg" />,
  },
  {
    name: "Manage Sub-Admin",
    path: absoluteUrls.admin.home.manage_sub_admin,
    icon: <BsPersonGear className="text-lg" />,
  },
  {
    name: "Manage CMS Pages",
    path: absoluteUrls.admin.home.manage_cms,
    icon: <BiFile className="text-lg" />,
  },
  {
    name: "Settings",
    path: absoluteUrls.admin.home.settings,
    icon: <LuSettings className="text-lg" />,
  },
];
