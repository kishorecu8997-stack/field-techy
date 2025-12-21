import { useEffect, useState } from "react";
import { useClientRegistrationStore } from "@/shared/store/useClientRegistrationStore";
import SignUpWithEmail from "./SignUpWithEmail";
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
const ClientSignUpPage = () => {
  const [isNumberLogin, setIsNumberLogin] = useState(false);
  const { registrationComplete, clearStore } = useClientRegistrationStore();

  // Check if registration is complete on mount
  useEffect(() => {
    if (registrationComplete) {
      // Registration already complete, clear old data
      console.log('[Registration] Previous registration complete, clearing store');
      clearStore();
    }
  }, [registrationComplete, clearStore]);

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

export default ClientSignUpPage;
