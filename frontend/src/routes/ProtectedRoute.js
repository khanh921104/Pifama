import React from "react";
import { Navigate } from "react-router-dom";

const parseUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("ProtectedRoute: parse user error", err);
  }
  // nếu không có user object nhưng có token, trả về object chứa token
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    return { token };
  }
  return null;
};

const getRoleFromToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return NaN;
    const json = JSON.parse(atob(payload));
    return Number(json.chuc_vu ?? json.role ?? json.role_id ?? json.vai_tro);
  } catch (err) {
    console.debug("getRoleFromToken decode error:", err);
    return NaN;
  }
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const user = parseUserFromStorage();

  console.debug("ProtectedRoute user:", user);

  // nếu không có user và không có token -> chuyển tới /login
  if (!user) return <Navigate to="/login" replace />;

  // lấy vai trò từ user object nếu có, còn không thử decode token
  let role = Number(user.chuc_vu ?? user.role ?? user.role_id ?? user.vai_tro);
  if (isNaN(role) && user.token) {
    role = getRoleFromToken(user.token);
  }

  console.debug("ProtectedRoute role:", role, "allowedRoles:", allowedRoles);

  // nếu không giới hạn role → cho phép
  if (!allowedRoles || allowedRoles.length === 0) return children;

  // chuẩn hóa allowedRoles -> số
  const allowed = allowedRoles.map((r) => Number(r));
  if (allowed.includes(role)) return children;

  // không đủ quyền -> chuyển về dashboard (không redirect vòng lặp)
  return <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;
