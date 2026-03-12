import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import {
  useCheckUserExistenceMutation,
  useForgotPassword,
} from "@/shared/apiServices/commonOpenApiService";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils/GlobalApiErrorHandler";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useToast } from "@/shared/components/commonUI/toastContext.tsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type ForgetPasswordFormData = {
  email: string;
};

interface AuthForgetPasswordProps {
  role: "client" | "engineer";
}

/**
 * A component for forgot password functionality.
 * @param {AuthForgetPasswordProps} props - The props for the AuthForgetPassword component.
 * @param {"client" | "engineer"} props.role - The role of the user.
 * @returns {JSX.Element} The AuthForgetPassword component.
 */

const AuthForgetPassword = ({ role }: AuthForgetPasswordProps) => {
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });
  const { success, error: toastError } = useToast();

  // Using mutate (fire-and-forget pattern) with onError callback for proper error handling
  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => {
      success("OTP sent to your email address");
      // Navigate directly to reset password page
      navigate(`${resetUrl}?email=${methods.getValues("email")}`);
    },
    onError: (err: unknown) => {
      toastError(
        GlobalApiErrorHandler.handle(err, "Failed to send OTP").message,
      );
    },
  });

  // Use useCheckUserExistenceMutation hook for checking if user exists
  const { mutateAsync: checkUserExists } = useCheckUserExistenceMutation();

  const handleSubmit = async (data: ForgetPasswordFormData) => {
    try {
      setIsCheckingUser(true);

      // First check if user exists
      const existence = await checkUserExists({ email: data.email });

      if (!existence?.emailExists) {
        toastError("This email is not registered in our system");
        return;
      }

      // User exists, proceed to send OTP (using mutate - no await needed)
      forgotPassword({
        body: {
          email: data.email,
          userRole: role,
        },
      });
    } catch (error) {
      // Show error to user when existence check fails
      toastError("Unable to verify email. Please try again.");
    } finally {
      setIsCheckingUser(false);
    }
  };

  const resetUrl =
    role === "client"
      ? absoluteUrls.client.auth.reset_password
      : absoluteUrls.engineer.auth.reset_password;

  // Removed: handleOtpSubmit and OTP Popup - now navigating directly after OTP is sent

  return (
    <div className="flex items-center justify-center max-w-lg md:w-lg ">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <img
              src={assetsConfig.logos.companyLogo}
              alt="logo"
              className="h-16 w-20 sm:h-20 sm:w-24"
            />
          </div>
          <h2 className="text-3xl font-bold">Forgot password</h2>
          <h2 className="text-base font-normal text-gray-700 dark:text-gray-300 ">
            Enter your email address to reset your password.
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
            loading={isPending || isCheckingUser}
            disabled={isPending || isCheckingUser}
          >
            Submit
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default AuthForgetPassword;
