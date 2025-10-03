import { useState } from "react";
import SignUp from "./SignUp";
import SignUpWithNumber from "./SignUpWithNumber";
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
