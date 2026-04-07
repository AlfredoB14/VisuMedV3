import React from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../redux/hooks";
import { selectIsAuthenticated } from "../redux/auth/auth.slice";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };