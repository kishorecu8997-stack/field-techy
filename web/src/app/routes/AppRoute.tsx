import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { withSuspense } from "./WithSuspense";
import { urls } from "@/config/urls";

const Layout = React.lazy(() => import("@/pages/auth"));
const SignInpage = React.lazy(
  () => import("@/pages/auth/components/signin_pages/SignInpage")
);
const SignUpPage = React.lazy(
  () => import("@/pages/auth/components/signup_pages/SignUpPage")
);
const ProfileSettingPage = React.lazy(
  () => import("@/pages/auth/components/profile_setup/ProfileSettingPage")
);
const ForgetPassword = React.lazy(
  () => import("@/pages/auth/components/ForgetPassword")
);
const ResetPassword = React.lazy(
  () => import("@/pages/auth/components/ResetPassword")
);
const BackgroundVerification = React.lazy(
  () => import("@/pages/auth/components/profile_setup/BackgroundVerification")
);
const SetPassword = React.lazy(
  () => import("@/pages/auth/components/profile_setup/SetPassword")
);
export const routes = createBrowserRouter([
  {
    path: urls.root,
    element: withSuspense(Layout),
    children: [
      { index: true, element: withSuspense(SignInpage) },
      { path: urls.auth.signUp, element: withSuspense(SignUpPage) },
      { path: urls.auth.profile_setup, element: withSuspense(ProfileSettingPage) },
      { path: urls.auth.forgetPassword, element: withSuspense(ForgetPassword) },
      { path: urls.auth.resetPassword, element: withSuspense(ResetPassword) },
      { path: urls.auth.background_verification, element: withSuspense(BackgroundVerification) },
      { path: urls.auth.set_password, element: withSuspense(SetPassword) },
    ],
  },
]);