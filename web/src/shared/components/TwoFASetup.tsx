import { useEffect, useState } from "react";
import { icons } from "@/config/icons";
import { useForm } from "react-hook-form";
import { FormContainer } from "./commonUI/inputs/FormContainer";
import { QRCodeCanvas } from "qrcode.react";
import { OTPInput } from "./commonUI/inputs/OTPInput";
import { Button } from "./commonUI/Buttons";

interface TwoFASetupProps {
  header?: string;
  description?: string;
  onClose?: () => void;
  onVerify: (token: string) => void;
  otpauthUrl?: string | null;
  enrolled?: boolean;
  buttonText?: string;
}

/**
 * TwoFASetup component
 *
 * Renders a Two-Factor Authentication setup and verification UI.
 * - Displays a QR code for authenticator apps if the user is not enrolled
 * - Accepts a 6-digit OTP code
 * - Shows a countdown for TOTP refresh interval
 *
 * @component
 * @param {TwoFASetupProps} props - Component properties
 */
const TwoFASetup: React.FC<TwoFASetupProps> = ({
  header = "Two-Factor Authentication",
  description = "Enter the 6-digit code from your authenticator app",
  onClose,
  onVerify,
  otpauthUrl,
  enrolled = false,
  buttonText = "Verify",
}) => {
  const TOTP_PERIOD = 30;
  const getTimeLeft = () =>
    TOTP_PERIOD - (Math.floor(Date.now() / 1000) % TOTP_PERIOD);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const methods = useForm<{ otp: string }>({ defaultValues: { otp: "" } });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (values: { otp: string }) => {
    onVerify(values.otp);
  };

  return (
    <div className="flex items-center justify-center">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative">
          <icons.closeFilled
            className="absolute top-3 right-3 h-6 w-6 cursor-pointer"
            onClick={onClose}
          />

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{header}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>

          {!enrolled && otpauthUrl && (
            <div className="flex justify-center mb-4">
              <QRCodeCanvas value={otpauthUrl} />
            </div>
          )}

          <OTPInput name="otp" length={6} errorAlign="center" />

          <div className="text-center text-sm text-gray-500 mt-3">
            Code refreshes in <strong>{timeLeft}s</strong>
          </div>

          <Button type="submit" className="w-full mt-4">
            {buttonText}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};

export default TwoFASetup;
