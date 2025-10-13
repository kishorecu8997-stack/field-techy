/**
 * Application route URLs.
 *
 * Centralized object for all routes used in the app.
 */
export const urls = {
  root: "/",
  auth: {
    login: "engineer/auth",
    forgetPassword: "/engineer/auth/forget-password",
    resetPassword: "/engineer/auth/reset-password",
    signUp: "/engineer/auth/signup",
    otp: "/engineer/auth/otp",
    profile_setup: "/engineer/auth/profile-setup",
    background_verification: "/engineer/auth/background-verification",
    set_password: "/engineer/auth/set-password",
    signin:"/engineer/auth/signin"
  },
  main:{
    home:"/engineer/home",
  }
};
