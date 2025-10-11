import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function RequireAuth({ allow = ["ORGANIZER", "GUEST"] }) {
  const { user, role } = useSelector((s) => s.auth);
  if (!user || !role) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!allow.includes(role)) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
}
