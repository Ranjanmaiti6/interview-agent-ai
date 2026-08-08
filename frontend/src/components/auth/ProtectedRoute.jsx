import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}) {
  const token =
    localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  // Not logged in
  if (!token || !userData) {
    return (
      <Navigate
        to={`/login?role=${role}`}
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to={`/login?role=${role}`}
        replace
      />
    );
  }

  // Wrong role
  if (user.role !== role) {
    return (
      <Navigate
        to={`/login?role=${user.role}`}
        replace
      />
    );
  }

  return children;
}