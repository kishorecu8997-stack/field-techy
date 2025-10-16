import PasswordSection from '../PasswordSection'

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
