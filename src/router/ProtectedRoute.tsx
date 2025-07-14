import { UserRole } from "@/enums";
import { useUserState } from "@/util/customHooks";
import { Navigate, useLocation } from "react-router-dom";

interface RouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
  noAccessRedirectTo?: string;
}

export const ProtectedRoutes = ({
  children,
  allowedRoles,
  noAccessRedirectTo,
}: RouteProps) => {
  const user = useUserState();
  const location = useLocation();

  const userRole = user.role;

  if (!user.uid)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const url = noAccessRedirectTo
      ? noAccessRedirectTo
      : [UserRole.ADMIN, UserRole.DEVELOPER].includes(userRole)
      ? "/dashboard"
      : "/introduction";

    return <Navigate to={url} state={{ from: location }} replace />;
  }

  return children;
};
