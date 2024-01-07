import path from "src/constants/path";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { accessRoutes, routeMain } from "./routes";
import Login from "./pages/Login";
import AuthenticatedGuard from "./guards/AuthenticatedGuard";
import UnAuthenticatedGuard from "./guards/UnAuthenticatedGuard";
import DashboardLayout from "src/layouts/dashboard";
export default function useRouteElements() {
  const renderRouter = useMemo(() => {
    return routeMain.map(({ path, Component }, index) => {
      return (
        <Route
          key={index}
          path={path}
          element={
            <Suspense>
              <Component />
            </Suspense>
          }
        />
      );
    });
  }, [path]);
  const renderRouterPhuKien = useMemo(() => {
    return accessRoutes.map(({ path, Component }, index) => {
      return (
        <Route
          key={index}
          path={path}
          element={
            <Suspense>
              <Component />
            </Suspense>
          }
        />
      );
    });
  }, [path]);
  const routeElements = (
    <Routes>
      <Route
        path=""
        element={
          <UnAuthenticatedGuard>
            <DashboardLayout />
          </UnAuthenticatedGuard>
        }
      >
        {renderRouter}
      </Route>

      <Route
        path="/login"
        element={
          <AuthenticatedGuard>
            <Login />
          </AuthenticatedGuard>
        }
      />
      <Route
        path={path.home}
        element={
          <UnAuthenticatedGuard>
            <DashboardLayout />
          </UnAuthenticatedGuard>
        }
      >
        {renderRouterPhuKien}
      </Route>
    </Routes>
  );

  return <>{routeElements}</>;
}

