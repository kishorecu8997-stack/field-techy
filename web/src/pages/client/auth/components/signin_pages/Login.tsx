import { assetsConfig } from "@/assets";
import { absoluteUrls } from "@/config/urls";
import { useClientLogin } from "@/shared/apiServices/client/clientOpenApiService";
import IconWithTheme from "@/shared/components/IconWithTheme";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
  CheckboxInput,
  InputField,
  PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { UserRole } from "@/shared/enums/users";
import {
  useUserSessionStore
} from "@/shared/store/useUserSessionStore";
import {
  decodeJwtPayload,
  type JwtClientPayload,
} from "@/utils/jwtUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginSchema,
  type LoginEmailFormData,
} from "../../validations/LoginEmail";

/**
 * Login component
 *
 * Renders the client sign-in form (email/password) with options to sign in
 * via phone number or LinkedIn.
 *
 * Props:
 * @param {{ setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>> }} props - A single prop used to switch to number-based login UI.
 * @returns {JSX.Element} Login form UI
 */
const Login = ({
  setIsNumberLogin,
}: {
  setIsNumberLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const setUserSession = useUserSessionStore((s) => s.setSession);

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useClientLogin(
    {
      onSuccess: async (resp) => {
        // Store the token
        if (resp.token) {
          localStorage.setItem("auth_token", resp.token);
        }

        // Decode the JWT payload to extract claims (e.g. regionId, userId).
        // If decoding fails or userId is absent, abort login — proceeding without
        // a valid userId would create a broken session (profile won't load, etc.)
        const payload = decodeJwtPayload<JwtClientPayload>(resp.token);
        if (!payload?.userId) {
          toast.error("Login failed: unable to verify session. Please try again.");
          return;
        }

        setUserSession({
          accessToken: resp.token,
          userId: String(payload.userId),
          role: UserRole.CLIENT,
          initiatedAt: Date.now(),
          regionId: payload?.regionId,
        });

        navigate(absoluteUrls.client.home.dashboard);
        toast.success("Logged in successfully");
      },
      onError: (error) => {
        console.error(error);
        // Skip showing toast for 401 errors as axios interceptor already handles it
        if (error instanceof AxiosError && error.response?.status === 401) {
          return;
        }
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        toast.error(errorMessage);
      },
    },
  );

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: LoginEmailFormData) => {
    await loginMutation({
      body: {
        email: data.email,
        password: data.password,
        userRole: UserRole.CLIENT,
      },
    });
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="px-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-8">
            <IconWithTheme
              lightLogo={assetsConfig.logos.ftLogo}
              darkLogo={assetsConfig.logos.ftLogoWhite}
              className="h-15 w-20"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h2>
            <h2 className="text-md font-extralight text-gray-700 dark:text-gray-300">
              Don't have an account?{" "}
              <NavLink
                to={absoluteUrls.client.auth.signup}
                className="text-teal-900 dark:text-teal-400 underline font-semibold "
              >
                Sign Up
              </NavLink>
            </h2>
          </div>
        </div>
        <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 w-full"
        >
          <InputField
            name="email"
            label="Email Address"
            type="email"
            required
          />
          <PasswordInput name="password" label="Password" required />
          <div className="flex items-center justify-between flex-wrap">
            <CheckboxInput name="rememberMe" secondaryLabel="Remember Me" />
            <NavLink
              className="text-teal-900 dark:text-teal-400 hover:underline font-semibold"
              to={absoluteUrls.client.auth.forget_password}
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
        <div
          className="text-gray-900 dark:text-gray-300 hover:underline flex flex-row gap-2 items-center justify-center pt-5 cursor-pointer"
          onClick={() => setIsNumberLogin(true)}
        >
          <CiMail className="dark:text-gray-300 text-lg" />
          Sign In with OTP
        </div>
      </div>
    </div>
  );
};

export default Login;
