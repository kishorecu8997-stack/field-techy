import AuthForgetPassword from "@/shared/components/auth/AuthForgetPassword";
import { UserRole } from "@/shared/enums/users";
/**
 * ForgetPassword component for client authentication.
 *
 * This component renders the AuthForgetPassword component
 * with the "client" role prop, providing the "Forgot Password"
 * functionality for client users.
 *
 * @component
 * @returns {JSX.Element} The rendered AuthForgetPassword component for clients.
 */

const ForgetPassword = () => {
  return <AuthForgetPassword role={UserRole.CLIENT} />;
};

export default ForgetPassword;
