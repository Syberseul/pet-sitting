import { useState } from "react";

import SingUp from "./SingUp";
import Login from "./Login";

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState<boolean>(true);

  const toggleShowSignUp = () => setShowSignUp((prev) => !prev);

  return showSignUp ? (
    <SingUp toggleShowSignUp={toggleShowSignUp} />
  ) : (
    <Login toggleShowSignUp={toggleShowSignUp} />
  );
}

export default LoginPage;
