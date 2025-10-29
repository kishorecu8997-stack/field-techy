import PasswordSection from "../../../../engineer/auth/components/PasswordSection";

export type SetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

/**
 * Set Password form component for creating a new user password.
 * Provides password and confirm password fields with validation.
 * Handles form submission and navigation to login page.
 *
 * @component
 * @example
 * return (
 *   <SetPassword />
 * )
 *
 * @returns {JSX.Element} The rendered Set Password form component
 */
const ClientSetPassword = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="p-10 w-full max-w-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Set Password</h2>
          <h2 className="text-md font-extralight">
            Please create a secure password for your account for safety reason.
          </h2>
        </div>
        {/* <FormContainer
          methods={methods}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-2"
        > */}
        <PasswordSection />
        {/* </FormContainer> */}
      </div>
    </div>
  );
};

export default ClientSetPassword;
