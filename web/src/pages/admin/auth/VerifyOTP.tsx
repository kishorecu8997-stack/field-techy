import { absoluteUrls } from "@/config/urls";
import OTPModal from "@/shared/components/commonUI/inputs/OTPModal";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminVerifyOTP() {
  const [, setVerified] = React.useState<boolean>(false);
  const name = "admin_verify_otp";
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      [name]: "",
    },
    mode: "onChange",
  });

  const { setValue, trigger } = methods;

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
