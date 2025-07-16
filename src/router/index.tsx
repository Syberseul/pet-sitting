import { createBrowserRouter } from "react-router-dom";

import { lazy, Suspense } from "react";

import { ProtectedRoutes } from "./ProtectedRoute";
import { UserRole } from "@/enums";

const lazyLoad = (factory: () => Promise<{ default: React.ComponentType }>) => {
  const Component = lazy(factory);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: lazyLoad(() => import("@/Pages/Home")),
    children: [
      {
        path: "/login",
        element: lazyLoad(() => import("@/Pages/Login")),
      },
      {
        path: "/details/:id?",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.ADMIN]}>
            {lazyLoad(() => import("@/Pages/Details"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.ADMIN, UserRole.DEVELOPER]}>
            {lazyLoad(() => import("@/Pages/Dashboard"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/introduction",
        element: (
          <ProtectedRoutes
            allowedRoles={[UserRole.DOG_OWNER, UserRole.VISITOR]}
          >
            {lazyLoad(() => import("@/Pages/Introduction"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/owners",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.ADMIN, UserRole.DEVELOPER]}>
            {lazyLoad(() => import("@/Pages/DogOwnerList"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.ADMIN, UserRole.DEVELOPER]}>
            {lazyLoad(() => import("@/Pages/UserList"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/tours",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.DOG_OWNER]}>
            {lazyLoad(() => import("@/Pages/TourList"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/dogs",
        element: (
          <ProtectedRoutes allowedRoles={[UserRole.DOG_OWNER]}>
            {lazyLoad(() => import("@/Pages/DogsInfo"))}
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);
