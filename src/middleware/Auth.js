import { Outlet, Navigate, useLocation } from "react-router-dom";

export const PrivateRoutes = () => {
  let authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem('authTokens')) : null;

  const location = useLocation();

  if (
    authTokens?.access &&
    ["/login", "/register", "reset", "recovery"].includes(location.pathname)
  )
    return <Navigate to={` ${location.state.from.pathname || "/"} `} replace />;

  return authTokens?.access ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoutes = () => {
  let authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem('authTokens')) : null;

  const location = useLocation();

  const pathname = Boolean(location?.state?.from?.pathname)
    ? location?.state?.from?.pathname
    : "/";

  if (
    !authTokens?.access &&
    ["/login", "/register", "/reset", "/recovery", "/verify-otp"].includes(
      location.pathname
    )
  ) {
    return <Outlet />;
  }

  return <Navigate to={pathname} replace />;
};
