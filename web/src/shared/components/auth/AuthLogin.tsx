import { assetsConfig } from "@/assets";
import { Button } from "@/shared/components/commonUI/Buttons";
import {
    CheckboxInput,
    InputField,
    PasswordInput,
} from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import IconWithTheme from "@/shared/components/IconWithTheme";
import { validatePassword } from "@/shared/libs/utils";
import React from "react";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import type { LoginEmailFormData } from "@/pages/client/auth/validations/LoginEmail";

interface AuthLoginProps {
    isLoggingIn: boolean;
    onEmailLoginSubmit: (data: LoginEmailFormData) => Promise<void>;
    onOtpLoginClick: () => void;
    signUpUrl: string;
    forgetPasswordUrl: string;
    validatePasswordRule?: boolean;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({
    isLoggingIn,
    onEmailLoginSubmit,
    onOtpLoginClick,
    signUpUrl,
    forgetPasswordUrl,
    validatePasswordRule = false,
}) => {
    const methods = useForm<LoginEmailFormData>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

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
                                to={signUpUrl}
                                className="text-teal-900 dark:text-teal-400 underline font-semibold "
                            >
                                Sign Up
                            </NavLink>
                        </h2>
                    </div>
                </div>
                <FormContainer
                    methods={methods as any}
                    onSubmit={onEmailLoginSubmit as any}
                    className="flex flex-col gap-3 w-full"
                >
                    <InputField
                        name="email"
                        label="Email Address"
                        type="email"
                        required
                    />
                    <PasswordInput
                        name="password"
                        label="Password"
                        required
                        rules={
                            validatePasswordRule
                                ? {
                                    required: "Password is required",
                                    validate: (v) => validatePassword(v),
                                }
                                : undefined
                        }
                    />
                    <div className="flex items-center justify-between flex-wrap">
                        <CheckboxInput name="rememberMe" secondaryLabel="Remember Me" />
                        <NavLink
                            className="text-teal-900 dark:text-teal-400 hover:underline font-semibold"
                            to={forgetPasswordUrl}
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
                    onClick={onOtpLoginClick}
                >
                    <CiMail className="dark:text-gray-300 text-lg" />
                    Sign In with OTP
                </div>
            </div>
        </div>
    );
};
