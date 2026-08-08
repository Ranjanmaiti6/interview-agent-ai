import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // ==========================================
  // Not authenticated
  // ==========================================

  if (!token || !userData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // Parse user
  // ==========================================

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error(
      "Invalid stored user data:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // Validate role
  // ==========================================

  if (
    !user ||
    !["admin", "employee"].includes(
      user.role
    )
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // Role protection
  // ==========================================

  if (
    role &&
    user.role !== role
  ) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.role === "employee") {
      return (
        <Navigate
          to="/employee"
          replace
        />
      );
    }
  }

  // ==========================================
  // Authorized
  // ==========================================

  return children;
}