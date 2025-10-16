import { icons } from "@/config/icons";
import type { DrawerMenuProps, MenuItems } from "@/shared/components/Drawer";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import LogoutConfirmationPopup from "../auth/LogoutConfirmationPopup";

const AccountSettings: React.FC<DrawerMenuProps> = ({
    onMenuItemClick,
    onClose,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuItems: MenuItems[] = [
        { label: 'Change Password', icon: icons.lock, key: 'changePassword' },
        { label: 'Manage Bank Accounts', icon: icons.wallet, key: 'manageBankAccounts' },
        { label: 'Notifications', icon: icons.notifications, key: 'notifications' },
        { label: 'Contact Us', icon: icons.contactSupport, key: 'contactUs' },
        { label: 'FAQs', icon: icons.fileLines, key: 'faqs' },
        { label: "Terms & Conditions", icon: icons.fileLines, key: "termsConditions" },
        { label: "About App", icon: icons.danger, key: "aboutApp" },
        {
            label: 'Logout',
            icon: icons.signOut,
            key: "logout",
            isLogout: true,
            onClick: () => {
                setIsOpen(true);
            },
        },
    ];


    return (
        <div>
            {menuItems.map((item, index, array) => (
                <React.Fragment key={item.key}>
                    <button
                        onClick={() => {
                            onMenuItemClick(item.key);
                            item.onClick?.();
                        }}
                        className={`
                    w-full flex items-center justify-between px-4 py-4 
                    transition-all duration-300 cursor-pointer 
                    text-gray-700 dark:text-gray-200 
                    hover:bg-gray-50 dark:hover:bg-gray-700 
                    hover:pl-6 
                    hover:text-teal-600 dark:hover:text-teal-400
                    ${item.isLogout
                                ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                : ""
                            }
                  `}
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon
                                className={`
                        h-5 w-5 transition-colors 
                        ${item.isLogout
                                        ? "text-red-600 dark:text-red-400 "
                                        : "text-gray-600 dark:text-gray-300 "
                                    }
                      `}
                            />
                            <span
                                className={`
                      ${item.isLogout
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-700 dark:text-gray-200"
                                    }
                      `}
                            >
                                {item.label}
                            </span>
                        </div>
                        <FaChevronRight
                            className={`
                      text-gray-400 dark:text-gray-500 
                      transition-colors
                    `}
                        />
                    </button>
                    {index < array.length - 1 && (
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    )}
                </React.Fragment>
            ))}
            <LogoutConfirmationPopup
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={() => console.log("confirm")}
                onCancel={() => setIsOpen(false)}
            />
        </div>
    )
}

export default AccountSettings
