import { useState } from "react";
import Login from "./Login";
import LoginWithNumber from "./LoginWithNumber";
const SignInpage = () => {
  const [isNumberLogin, setIsNumberLogin] = useState(false);

  return (
    <div>
      {isNumberLogin ? (
        <LoginWithNumber setIsNumberLogin={setIsNumberLogin} />
      ) : (
        <Login setIsNumberLogin={setIsNumberLogin} />
      )}
    </div>
  );
};

export default SignInpage;
