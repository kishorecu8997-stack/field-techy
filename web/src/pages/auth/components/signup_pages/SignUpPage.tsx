import { useState } from "react";
import SignUp from "./SignUp";
import SignUpWithNumber from "./SignUpWithNumber";

/**
 * Sign Up page component that provides both email and phone number registration options.
 * Manages the state to toggle between email signup and phone number signup components.
 * 
 * @component
 * @example
 * return (
 *   <SignUpPage />
 * )
 * 
 * @returns {JSX.Element} The rendered Sign Up page component with conditional rendering
 */
const SignUpPage = () => {
  const [isNumberLogin, setIsNumberLogin] = useState(false);

  return (
    <div>
      {isNumberLogin ? (
        <SignUpWithNumber setIsNumberLogin={setIsNumberLogin} />
      ) : (
        <SignUp setIsNumberLogin={setIsNumberLogin} />
      )}
    </div>
  );
};

export default SignUpPage;
