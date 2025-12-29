import { useCallback, useEffect, useState } from "react";
import { Secret, TOTP } from "otpauth";
import { toast } from "react-toastify";

/**
 * Custom React hook to handle Two-Factor Authentication (2FA) using TOTP.
 *
 * Responsibilities:
 * - Generate and persist a TOTP secret
 * - Generate an otpauth URL for QR code scanning
 * - Open a verification modal when 2FA is enabled
 * - Verify TOTP tokens or backup codes
 *
 * @param {string} email - The user's email used as the TOTP label
 * @param {() => void} [onSuccess] - Optional callback executed after successful authentication
 *
 * @returns {{
 *   isOpen: boolean;
 *   otpauthUrl: string | null;
 *   handleSubmit: () => void;
 *   verify: (token: string) => void;
 *   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
 * }}
 */
export const useTwoFactorAuth = (email: string, onSuccess?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [base32, setBase32] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);

  // Load persisted values once
  useEffect(() => {
    setBase32(localStorage.getItem("totp_secret"));
    setOtpauthUrl(localStorage.getItem("otpauth_url"));
  }, []);

  const setup2FA = useCallback(() => {
    const storedEmail = localStorage.getItem("email");

    if (!base32 || storedEmail !== email) {
      const secret = new Secret({ size: 20 });

      const totp = new TOTP({
        issuer: "Field-Techy",
        label: email,
        secret,
      });

      const newBase32 = secret.base32;
      const newOtpauthUrl = totp.toString();

      localStorage.setItem("totp_secret", newBase32);
      localStorage.setItem("otpauth_url", newOtpauthUrl);
      localStorage.setItem("email", email);
      localStorage.setItem("2fa_enrolled", "false");

      setBase32(newBase32);
      setOtpauthUrl(newOtpauthUrl);
    }
  }, [base32, email]);

  const handleSubmit = useCallback(() => {
    const twoFactorEnabled = localStorage.getItem("2FA_Auth") === "true";

    if (!twoFactorEnabled) {
      onSuccess?.();
      return;
    }

    setIsOpen(true);
    setup2FA();
  }, [onSuccess, setup2FA]);

  const verify = useCallback(
    (token: string) => {
      if (!base32) return;

      const backupCodes = localStorage.getItem("backup_codes") ?? "";

      const secret = Secret.fromBase32(base32);

      const totp = new TOTP({
        issuer: "Field-Techy",
        label: email,
        period: 30,
        secret,
      });

      const valid =
        totp.validate({
          token: token ?? "",
          window: 1,
        }) !== null;

      if (valid || backupCodes.includes(token)) {
        localStorage.setItem("2fa_enrolled", "true");
        setOtpauthUrl(null); // hide QR
        onSuccess?.();
        toast.success("Logged in successfully");
      } else {
        toast.error("Code Invalid");
      }
    },
    [base32, email, onSuccess]
  );

  return {
    isOpen,
    otpauthUrl,
    handleSubmit,
    verify,
    setIsOpen,
  };
};
