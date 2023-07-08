import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const PrivateRoutes = () => {
  const { auth } = useAuthStore((state) => state);

  const location = useLocation();

  if (
    !auth &&
    ["/login", "/register", "reset", "recovery"].includes(location.pathname)
  )
    return <Navigate to={` ${location.state.from.pathname || "/"} `} replace />;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoutes = () => {
  const location = useLocation();
  const { auth } = useAuthStore((state) => state);

  const pathname = location?.state
    ? location?.state?.pathname
    : "/";

  if (
    !auth &&
    ["/login", "/register", "/reset", "/recovery", "/verify-otp"].includes(
      location.pathname
    )
  ) {
    return <Outlet />;
  }

  return <Navigate to={pathname} replace />;
};
