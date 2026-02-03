import React, { useEffect, useState } from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import { TbCopy } from "react-icons/tb";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";
import { removeTwoFaStorage, setTwoFaStorage } from "@/utils/TwoFAStorage";

/**
 * SecurityPage Component
 *
 * A React functional component that renders the user's security settings within a drawer layout.
 * It allows the user to enable or disable Two-Factor Authentication (2FA) and manage backup codes.
 * The component also displays verification status for email and mobile number, which are prerequisites
 * for enabling 2FA. Backup codes can be generated, viewed, and copied to the clipboard.
 *
 * @component
 * @example
 * <SecurityPage />
 *
 * @remarks
 * - Two-Factor Authentication can only be enabled if both email and mobile are verified.
 * - Backup codes are stored in `localStorage` and cleared when 2FA is disabled.
 * - Clicking the copy icon next to a backup code copies it to the clipboard and shows a success toast.
 *
 * @dependencies
 * - `react`, `react-icons/tb`, `react-toastify`
 * - Local configuration: `icons`, `DrawerMenuSection`, `Button`, `MenuItem`, `DrawerMenuProps`
 *
 * @state
 * - `twoFactorEnabled` (boolean): Controls whether 2FA is active.
 * - `codeBackupEnabled` (boolean): Controls visibility of the backup codes UI.
 * - `codes` (number[]): Array of generated 6-digit backup codes.
 *
 * @localStorage
 * - `"2FA_Auth"`: Set to `"true"` when 2FA is enabled.
 * - `"backup_codes"`: Stores the JSON-serialized array of backup codes.
 * - `"totp_secret"`, `"otpauth_url"`: Removed when 2FA is disabled (assumed used elsewhere).
 *
 * @returns {JSX.Element} The rendered security settings UI.
 */
const SecurityPage: React.FC<DrawerMenuProps> = () => {
  const emailVerified = true; // Replace with actual check
  const mobileVerified = true; // Replace with actual check
  const isVerified = emailVerified && mobileVerified;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [codeBackupEnabled, setCodeBackupEnabled] = useState<boolean>(false);
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    if (twoFactorEnabled) {
      // Update 2FA storage with backup codes and enabled flag
      setTwoFaStorage({
        backupCodes: codes,
        enabled: twoFactorEnabled,
      });
    } else {
      // Remove all 2FA storage if 2FA is disabled
      removeTwoFaStorage();
    }
  }, [codes, twoFactorEnabled]);

  const menuItems: MenuItem[] = [
    {
      id: "two_factor_auth",
      label: "Two-Factor Authentication",
      icon: icons.security,
      isToggle: true,
      toggleValue: twoFactorEnabled,
      onToggleChange: setTwoFactorEnabled,
      disabled: !isVerified,
    },
  ];

  const subMenuItem: MenuItem[] = [
    {
      id: "2fa_code_backup",
      label: "Code Backup",
      icon: icons.codebackup,
      onClick() {
        setCodeBackupEnabled(!codeBackupEnabled);
      },
    },
  ];

  function generateBackupCodes() {
    const backupCodes: string[] = [];
    for (let i = 0; i < 4; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // convert to string
      backupCodes.push(code);
    }
    setCodes(backupCodes);
  }

  return (
    <div>
      {!twoFactorEnabled && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p className="text-sm">
            To enable Two-Factor Authentication, please verify your email and
            mobile number.
          </p>
          <p className="text-sm mt-1">
            Email Verified: {emailVerified ? "Yes" : "No"} <br /> Mobile
            Verified: {mobileVerified ? "Yes" : "No"}
          </p>
        </div>
      )}
      <DrawerMenuSection items={menuItems} ariaLabel="Security Settings" />
      {twoFactorEnabled && (
        <DrawerMenuSection className="my-4" items={subMenuItem} />
      )}
      {codeBackupEnabled && twoFactorEnabled && (
        <div className="w-full bg-neutral-primary-soft border rounded-xl border-gray-200 shadow-sm rounded-base">
          <ul
            role="list"
            className={`${
              codes.length > 0 ? "block" : "hidden"
            } space-y-3 p-6 divide-y divide-gray-200`}
          >
            {codes.map((code) => (
              <li
                key={code}
                className="flex items-center justify-between pb-3 text-gray-700"
              >
                <div className="flex items-center font-medium dark:text-gray-300">
                  <span>{code}</span>
                </div>

                <TbCopy
                  onClick={() => {
                    toast.success("Copied Successfully");
                    navigator.clipboard.writeText(`${code}`);
                  }}
                  className="text-xl cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                />
              </li>
            ))}
          </ul>
          <div className="flex justify-end px-2 py-2">
            <Button onClick={generateBackupCodes}>Generate</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
