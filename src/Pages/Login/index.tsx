import { useState } from "react";

import SingUp from "./SingUp";
import Login from "./Login";

import { useUserState } from "@/util/customHooks";
import UserInfo from "./UserInfo";

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState<boolean>(true);

  const user = useUserState();

  const toggleShowSignUp = () => setShowSignUp((prev) => !prev);

  return user.uid ? (
    <UserInfo />
  ) : showSignUp ? (
    <SingUp toggleShowSignUp={toggleShowSignUp} />
  ) : (
    <Login toggleShowSignUp={toggleShowSignUp} />
  );
}

export default LoginPage;
