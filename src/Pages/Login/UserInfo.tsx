import { useI18n } from "@/Context/languageContext";
import { UserRole } from "@/enums";
import { userLogout } from "@/store/modules/userStore";
import { useUserState } from "@/util/customHooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useI18n();

  const user = useUserState();

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <div>
        {t.userName}: {user.userName}
      </div>
      <div>
        {t.email}: {user.email}
      </div>
      {user.role == UserRole.DOG_OWNER ? (
        <div>Show dog owner dogs in a list</div>
      ) : user.role == UserRole.ADMIN || user.role == UserRole.DEVELOPER ? (
        <div>Show admin overall details</div>
      ) : (
        <div>Show button to become a dog owner</div>
      )}
      <span
        style={{
          textDecoration: "underline",
          color: "#11f",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        {t.signOut}
      </span>
    </>
  );
}

export default UserInfo;
