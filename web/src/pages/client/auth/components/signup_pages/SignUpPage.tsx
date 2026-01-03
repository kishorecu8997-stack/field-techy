import BasicDetails from "../profile_setup/updated_profile_setup/BasicDetails";

/**
 * Sign Up page component that renders the Basic Details form directly.
 * This is now the entry point for client registration.
 */
const ClientSignUpPage = () => {
  return (
    <div className="flex w-full justify-center">
      <BasicDetails />
    </div>
  );
};

export default ClientSignUpPage;
