import React, { useEffect, useState } from "react";
import { icons } from "@/config/icons";
import DrawerMenuSection from "@/shared/components/drawer/DrawerMenuSection";
import type { MenuItem } from "../../account_settings/types";
import type { DrawerMenuProps } from "@/shared/components/drawer/Drawer";
import { TbCopy } from "react-icons/tb";
import { Button } from "@/shared/components/commonUI/Buttons";
import { toast } from "react-toastify";

/**
 * Security UI: Manage 2FA (requires verified email & mobile).
 * Persist state to localStorage with error handling.
 * @returns [value, setValue]
 */

const SecurityPage: React.FC<DrawerMenuProps> = () => {

  const emailVerified = true; // Replace with actual check
  const mobileVerified = true; // Replace with actual check
  const isVerified = emailVerified && mobileVerified;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [codeBackupEnabled, setCodeBackupEnabled] = useState<boolean>(false);
  const [codes, setCodes] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem("backup_codes", JSON.stringify(codes));
    if (twoFactorEnabled) {
      localStorage.setItem("2FA_Auth", `${twoFactorEnabled}`);
    } else {
      localStorage.removeItem("2FA_Auth");
      localStorage.removeItem("totp_secret");
      localStorage.removeItem("otpauth_url");
      localStorage.removeItem("backup_codes");
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
    const backupCodes: number[] = [];
    for (let i = 0; i < 4; i++) {
      const code = Math.floor(100000 + Math.random() * 900000);
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
      {codeBackupEnabled && (
        <div className="w-full bg-neutral-primary-soft border rounded-xl border-gray-200 shadow-sm rounded-base">
          <ul
            role="list"
            className={`${
              codes.length > 0 ? "block" : "hidden"
            } space-y-3 p-6 divide-y divide-gray-200`}
          >
            {codes.map((code) => (
              <li className="flex items-center justify-between pb-3 text-gray-700">
                <div className="flex items-center font-medium">
                  <span>{code}</span>
                </div>

                <TbCopy
                  onClick={() => {
                    toast.success("Copied Successfully");
                    navigator.clipboard.writeText(`${code}`);
                  }}
                  className="text-xl cursor-pointer"
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
