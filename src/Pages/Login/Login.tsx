import { Props } from "@/Interface/userInterface";

function Login(props: Props) {
  const { toggleShowSignUp } = props;
  return (
    <div>
      Login <button onClick={toggleShowSignUp}>toggle</button>
    </div>
  );
}

export default Login;
