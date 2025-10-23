import PasswordSection from '../PasswordSection'

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
     <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Set Password</h2>
        <h2 className="text-md font-extralight">
          Please create a secure password for your account.
        </h2>
      </div>
      <PasswordSection />
    </div>
  )
}

export default SetPassword
