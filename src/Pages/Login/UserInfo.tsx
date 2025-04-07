import { userLogout } from "@/store/modules/userStore";
import { useUserState } from "@/util/customHooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useUserState();

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <div>User name: {user.username}</div>
      <div>Email: {user.email}</div>
      <span
        style={{
          textDecoration: "underline",
          color: "#11f",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Log out
      </span>
    </>
  );
}

export default UserInfo;
