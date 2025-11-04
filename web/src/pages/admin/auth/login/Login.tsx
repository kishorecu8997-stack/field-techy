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

export default function AdminLogin() {
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    // console.log("Admin Login Submitted");
    navigate("/admin/dashboard");
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #034444, #014d45)" }}
    >
      <div className="bg-white dark:text-gray-300 dark:bg-gray-800 items-center rounded-2xl shadow-lg p-6 w-1/4">
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
            label="Email Email Address"
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
              validate: validatePassword,
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
            className="w-full bg-gradient-to-r from-teal-700 to-teal-900 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </Button>
        </FormContainer>
      </div>
    </div>
  );
}
