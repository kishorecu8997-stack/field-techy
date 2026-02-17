import AuthForgetPassword from "@/shared/components/auth/AuthForgetPassword";

/**
 * ForgetPassword component for engineer authentication.
 *
 * This component renders the AuthForgetPassword component
 * with the "engineer" role prop, providing the "Forgot Password"
 * functionality for engineer users.
 *
 * @component
 * @returns {JSX.Element} The rendered AuthForgetPassword component for engineers.
 */

const ForgetPassword = () => {
  return <AuthForgetPassword role="engineer" />;
};

export default ForgetPassword;
