import { useState } from "react";
import Login from "./Login";
import LoginWithOtp from "./LoginWithOtp";

/**
 * Sign In page component that provides both email and phone number login options.
 * Manages the state to toggle between email login and phone number login components.
 *
 * @component
 * @example
 * return (
 *   <ClientSignInPage />
 * )
 *
 * @returns {JSX.Element} The rendered Sign In page component with conditional rendering
 */
const ClientSignInPage = () => {
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  return (
    <div className="flex w-full justify-center">
      {isOtpLogin && <LoginWithOtp setIsOtpLogin={setIsOtpLogin} />}
      {!isOtpLogin && <Login setIsOtpLogin={setIsOtpLogin} />}
    </div>
  );
};

export default ClientSignInPage;
