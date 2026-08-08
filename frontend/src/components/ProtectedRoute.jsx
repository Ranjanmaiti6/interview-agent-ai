import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}) {
  const token = localStorage.getItem("token");

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  // Not logged in
  if (!token || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role && user.role !== role) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "employee") {
      return <Navigate to="/employee" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}