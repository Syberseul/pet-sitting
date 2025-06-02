import { createBrowserRouter } from "react-router-dom";

import { lazy, Suspense } from "react";

import { ProtectedRoutes } from "./ProtectedRoute";

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
        element: lazyLoad(() => import("@/Pages/Details")),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            {lazyLoad(() => import("@/Pages/Dashboard"))}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/introduction",
        element: lazyLoad(() => import("@/Pages/Introduction")),
      },
      {
        path: "/owners",
        element: lazyLoad(() => import("@/Pages/DogOwnerList")),
      },
      {
        path: "/users",
        element: lazyLoad(() => import("@/Pages/UserList")),
      },
      {
        path: "/tours",
        element: lazyLoad(() => import("@/Pages/TourList")),
      },
    ],
  },
]);
