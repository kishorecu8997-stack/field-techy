import { useState } from "react";
import Login from "./Login";
import LoginWithOTP from "./LoginWithOTP";

/**
 * A top-level component that orchestrates the user sign-in experience.
 *
 * This component acts as a controller, allowing users to switch between
 * two different login methods: standard email/password login (`Login` component)
 * and OTP-based login (`LoginWithOTP` component).
 *
 * It manages the state (`isNumberLogin`) to conditionally render the appropriate
 * login form based on the user's choice.
 *
 * @returns {JSX.Element} The rendered sign-in page, displaying either the email or OTP login form.
 */
const SignInPage = () => {
  const [isNumberLogin, setIsNumberLogin] = useState(false);

  return (
    <div className="flex w-full justify-center">
      {isNumberLogin ? (
        <LoginWithOTP setIsNumberLogin={setIsNumberLogin} />
      ) : (
        <Login setIsNumberLogin={setIsNumberLogin} />
      )}
    </div>
  );
};

export default SignInPage;
