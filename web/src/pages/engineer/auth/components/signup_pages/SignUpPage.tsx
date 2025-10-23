import { useState } from "react";
import SignUpWithEmail from "./SignUpWithEmail";
import SignUpWithNumber from "./SignUpWithNumber";

/**
 * A top-level component that orchestrates the user sign-up experience.
 *
 * This component acts as a controller, allowing users to switch between
 * two different registration methods: email-based sign-up (`SignUpWithEmail` component)
 * and phone number-based OTP sign-up (`SignUpWithNumber` component).
 *
 * It manages the state (`isNumberLogin`) to conditionally render the appropriate
 * sign-up form based on the user's choice.
 *
 * @returns {JSX.Element} The rendered sign-up page, displaying either the email or phone registration form.
 */
const SignUpPage = () => {
  const [isNumberLogin, setIsNumberLogin] = useState(false);

  return (
    <div className="flex w-full justify-center">
      {isNumberLogin ? (
        <SignUpWithNumber setIsNumberLogin={setIsNumberLogin} />
      ) : (
        <SignUpWithEmail setIsNumberLogin={setIsNumberLogin} />
      )}
    </div>
  );
};

export default SignUpPage;
