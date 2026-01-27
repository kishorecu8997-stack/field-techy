import { assetsConfig } from "@/assets";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import OTPPage from "./OTPPage";
import { Button } from "@/shared/components/commonUI/Buttons";
import { absoluteUrls } from "@/config/urls";
import IconWithTheme from "@/shared/components/IconWithTheme";
export type ForgetPasswordFormData = {
  email: string;
};

/**
 * Renders the "Forgot Password" form, allowing users to initiate a password reset.
 *
 * This component prompts the user to enter their email address. Upon submission,
 * it displays an OTP verification modal (`OTPPage`). If the OTP is successfully
 * verified, the user is then navigated to the "Reset Password" page to set a new password.
 *
 * It utilizes `react-hook-form` for form state management and validation,
 * and a generic `Popup` component to display the OTP verification step.
 *
 * @returns {JSX.Element} The rendered Forgot Password form component.
 */
const ForgetPassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={assetsConfig.logos.ftLogoWhite}
              className="h-15 w-20"
            />
          </div>
          <h2 className="text-3xl font-bold">Forgot password</h2>
          <h2 className="text-base font-normal text-gray-700 dark:text-gray-300 ">
            Enter your email id address to reset your password.
          </h2>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col  p-2 gap-10"
        >
          <InputField
            name="email"
            label="Email ID"
            type="text"
            required
            leftIcon={
              <MdOutlineMailOutline className="text-lg text-gray-500" />
            }
            rules={validateEmailRules}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-lg hover:opacity-90 transition py-6"
          >
            Submit
          </Button>
        </FormContainer>

        <Popup open={isOpen} onClose={() => setIsOpen(false)}>
          <OTPPage
            header="Enter the OTP"
            description="We sent you an OTP code"
            onClose={() => setIsOpen(false)}
            // handleNavigate={() => navigate(absoluteUrls.engineer.auth.reset_password)}
            onSubmit={() => {
              if (location.pathname.includes("engineer")) {
                navigate(absoluteUrls.engineer.auth.reset_password);
              } else if (location.pathname.includes("client")) {
                navigate(absoluteUrls.client.auth.reset_password);
              }
            }}
          />
        </Popup>
      </div>
    </div>
  );
};

export default ForgetPassword;
