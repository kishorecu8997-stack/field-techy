import { absoluteUrls } from "@/config/urls";
import OTPModal from "@/shared/components/commonUI/inputs/OTPModal";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * AdminVerifyOTP component renders a form for entering and verifying a One Time Passcode (OTP).
 * Utilizes react-hook-form for form state management and validation.
 * Navigates to the reset password page upon successful OTP verification.
 *
 * @component
 */
export default function AdminVerifyOTP() {
  /**
   * State to track OTP verification status.
   */
  const [, setVerified] = React.useState<boolean>(false);

  /**
   * Name of the OTP input field.
   */
  const name = "admin_verify_otp";

  /**
   * React Router navigation function.
   */
  const navigate = useNavigate();

  /**
   * React Hook Form methods for managing form state and validation.
   */
  const methods = useForm({
    defaultValues: {
      [name]: "",
    },
    mode: "onChange",
  });

  const { setValue, trigger } = methods;

  /**
   * Handles successful OTP verification. Navigates to the reset password page.
   * @returns {void}
   */
  const onVerifySuccess = React.useCallback(() => {
    // console.log("OTP Verified Successfully!");
    navigate(`${absoluteUrls.admin.auth.reset_password}`);
  }, [navigate]);

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <FormProvider {...methods}>
        <div>
          <OTPModal
            header="Enter One Time Passcode"
            description="Please enter the 4 digit code that we’ve sent to your email."
            name={name}
            onVerifySuccess={() => {
              setVerified(true);
              onVerifySuccess?.();

              setValue(name, "");
              trigger(name);
            }}
            isClose={true}
            footer={
              <div className="my-4 text-center">
                <NavLink
                  className="dark:text-teal-400 text-center hover:underline text-sm text-gray-600 underline font-semibold"
                  to={absoluteUrls.admin.auth.forget_password}
                >
                  Back to Forgot Password
                </NavLink>
              </div>
            }
          />
        </div>
      </FormProvider>
    </div>
  );
}
