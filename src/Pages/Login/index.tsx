import { useState } from "react";

import SignUp from "./SignUp";
import Login from "./Login";

import { useUserState } from "@/util/customHooks";
import UserInfo from "./UserInfo";

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState<boolean>(false);

  const user = useUserState();

  const toggleShowSignUp = () => setShowSignUp((prev) => !prev);

  return user.uid ? (
    <UserInfo />
  ) : showSignUp ? (
    <SignUp toggleShowSignUp={toggleShowSignUp} />
  ) : (
    <Login toggleShowSignUp={toggleShowSignUp} />
  );
}

export default LoginPage;
