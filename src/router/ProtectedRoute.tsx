import { useUserState } from "@/util/customHooks";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const user = useUserState();
  const location = useLocation();

  if (!user.uid)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};
