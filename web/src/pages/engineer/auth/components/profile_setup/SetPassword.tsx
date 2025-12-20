import PasswordSection from "../PasswordSection";

/**
 * A component that represents the final step of the registration process: setting a password.
 *
 * This component serves as a container for the password creation UI. It displays a
 * title and description, and renders the `PasswordSection` component which contains
 * the actual input fields for the password and its confirmation.
 *
 * It is designed to be displayed as the last view within the `MultiStepRegistrationForm`.
 */
const SetPassword = () => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <PasswordSection />
    </div>
  );
};

export default SetPassword;
