import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import { validateEmailRules } from "@/shared/components/commonUI/emailValidation";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { validatePassword } from "@/shared/libs/utils";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types";
import { absoluteUrls } from "@/config/urls";
import { toast } from "react-toastify";
import {
  useUserSessionStore,
  type UserSession,
} from "@/shared/store/useUserSessionStore";
import { UserRole } from "@/shared/enums/users";
import { useAdminLogin } from "@/shared/apiServices/admin/adminOpenApiService";
import { AxiosError } from "axios";

/**
 * AdminLogin
 *
 * Admin authentication page component providing a login form with email and password fields.
 * Features form validation, remember me functionality, and forgot password link.
 *
 * Form Features:
 * - Email validation with custom rules
 * - Password validation with custom rules
 * - Remember me checkbox
 * - Forgot password link
 * - Responsive styling with dark mode support
 *
 * @returns {JSX.Element} Admin login form with branding and validation
 */
export default function AdminLogin() {
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useAdminLogin({
    onSuccess: async (resp) => {
      // Token is intentionally stored in localStorage in addition to the
      // persisted session store to support consumers outside Zustand
      if (resp.token) {
        localStorage.setItem("auth_token", resp.token);
      }

      setUserSession({
        accessToken: resp.token,
        userId: "uuid-123", // TODO: Get actual user ID from token or profile response
        role: UserRole.ADMIN,
        initiatedAt: Date.now(),
      } as UserSession);

      navigate(absoluteUrls.admin.home.dashboard);
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      // 401 (unauthorized) responses are handled globally by an Axios interceptor
      if (error instanceof AxiosError && error.response?.status === 401) {
        return;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    await loginMutation({
      email: data.email,
      password: data.password,
      userRole: UserRole.ADMIN,
    });
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <div className="bg-white dark:text-gray-300 dark:bg-gray-800 items-center mx-4 md:mx-0 rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-5/12 xl:w-1/4">
        <img
          src={assetsConfig.logos.ftLogo}
          alt="admin_logo"
          className="mx-auto mb-2 h-14 w-14 dark:invert dark:brightness-0 dark:filter"
        />
        <p className="text-xl text-center font-bold">
          Welcome to the Admin Panel
        </p>

        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-6 w-full"
        >
          <InputField
            name="email"
            label="Email Address"
            type="text"
            required
            rules={validateEmailRules}
          />
          <PasswordInput
            name="password"
            label="Password"
            required
            rules={{
              required: "Password is required",
              validate: (v: string) => validatePassword(v),
            }}
          />
          <div className="flex items-center justify-between flex-wrap">
            <CheckboxInput name="rememberMe" secondaryLabel="Remember me" />
            <NavLink
              className="dark:text-teal-400 hover:underline font-semibold"
              to={absoluteUrls.admin.auth.forget_password}
            >
              Forgot Password?
            </NavLink>
          </div>
          <Button
            type="submit"
            loading={isLoggingIn}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </FormContainer>
      </div>
    </div>
  );
}
