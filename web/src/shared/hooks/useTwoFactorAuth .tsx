import { useCallback, useEffect, useState } from "react";
import { Secret, TOTP } from "otpauth";
import { toast } from "react-toastify";
import type { UserSession } from "../store/useUserSessionStore";
import { UserRole } from "../enums/users";
import { getTwoFaStorage, setTwoFaStorage } from "@/utils/TwoFAStorage";

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
 *   isTwoFaOpen: boolean;
 *   otpauthUrl: string | null;
 *   handleSubmit: () => void;
 *   verify: (token: string) => void;
 *   setIsTwoFaOpen: React.Dispatch<React.SetStateAction<boolean>>;
 * }}
 */
export const useTwoFactorAuth = (
  email: string,
  setUserSession: any,
  onSuccess?: () => void,
) => {
  const [isTwoFaOpen, setIsTwoFaOpen] = useState(false);
  const [base32, setBase32] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);

  // Load persisted values once
  useEffect(() => {
    const twoFa = getTwoFaStorage();
    setBase32(twoFa.secretBase32);
    setOtpauthUrl(twoFa.otpauthUrl);
  }, []);

  const setup2FA = useCallback(() => {
    const twoFa = getTwoFaStorage();

    if (!base32 || twoFa.email !== email) {
      const secret = new Secret({ size: 20 });

      const totp = new TOTP({
        issuer: "Field-Techy",
        label: email,
        secret,
      });

      const newBase32 = secret.base32;
      const newOtpauthUrl = totp.toString();

      setTwoFaStorage({
        email: email,
        secretBase32: newBase32,
        otpauthUrl: newOtpauthUrl,
        enrolled: false,
        enabled: true,
      });

      setBase32(newBase32);
      setOtpauthUrl(newOtpauthUrl);
    }
  }, [base32, email]);

  const handleSubmit = useCallback(() => {
    const twoFa = getTwoFaStorage();

    if (!twoFa.enabled) {
      onSuccess?.();
      return;
    }

    setIsTwoFaOpen(true);
    setup2FA();
  }, [onSuccess, setup2FA]);

  const verify = useCallback(
    (token: string) => {
      if (!base32) return;

      const twoFa = getTwoFaStorage();
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

      const session: UserSession = {
        accessToken: "demo-token",
        userId: "demo-user",
        role: UserRole.ENGINEER,
        initiatedAt: Date.now(),
      };

      if (valid || twoFa.backupCodes.includes(token)) {
        setOtpauthUrl(null); // hide QR
        setUserSession(session);
        onSuccess?.();
        setTwoFaStorage({
          email: email,
          secretBase32: base32,
          otpauthUrl: otpauthUrl,
          enrolled: true,
          enabled: true,
        });
        toast.success("Logged in successfully");
      } else {
        toast.error("Code Invalid");
      }
    },
    [base32, email, onSuccess],
  );

  return {
    isTwoFaOpen,
    otpauthUrl,
    handleSubmit,
    verify,
    setIsTwoFaOpen,
  };
};
