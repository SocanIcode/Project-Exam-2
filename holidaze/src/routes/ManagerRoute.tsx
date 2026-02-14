import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ManagerRoute({ children }: Props) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
