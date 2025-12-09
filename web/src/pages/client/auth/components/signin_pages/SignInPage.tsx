import { useState } from "react";
import Login from "./Login";
import LoginWithNumber from "./LoginWithNumber";

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
  const [isNumberLogin, setIsNumberLogin] = useState(false);

  return (
    <div className="flex w-full justify-center">
      {isNumberLogin ? (
        <LoginWithNumber setIsNumberLogin={setIsNumberLogin} />
      ) : (
        <Login setIsNumberLogin={setIsNumberLogin} />
      )}
    </div>
  );
};

export default ClientSignInPage;
