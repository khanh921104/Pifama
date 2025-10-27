import React from "react";
import { Navigate } from "react-router-dom";

const parseUserFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (token && rawUser && rawUser !== "undefined" && rawUser !== "null") {
      const parsedUser = JSON.parse(rawUser);
      console.log("📦 Parsed user from localStorage:", parsedUser);
      return { ...parsedUser, token };
    }

    if (token) return { token }; // fallback nếu chỉ có token
  } catch (err) {
    console.error("❌ ProtectedRoute parse error:", err);
  }
  return null;
};

const getRoleFromToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      console.warn("⚠️ Token không hợp lệ, không đủ phần.");
      return NaN;
    }

    const payload = parts[1];
    const decoded = atob(payload);
    const json = JSON.parse(decoded);
    console.log("🧩 Token payload (decoded):", json);

    // ✅ backend luôn trả chuc_vu (số)
    const role = Number(json.chuc_vu ?? 0);
    return isNaN(role) ? 0 : role;
  } catch (err) {
    console.warn("⚠️ Lỗi khi decode token:", err);
    return 0;
  }
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const user = parseUserFromStorage();

  console.log("👤 User object from storage:", user);

  // Nếu không có user hoặc token → về login
  if (!user || !user.token) {
    console.warn("🚫 Không tìm thấy user hoặc token → chuyển /login");
    return <Navigate to="/login" replace />;
  }

  // Lấy role từ user object hoặc token
  let role = Number(user.chuc_vu);
  if (isNaN(role)) {
    role = getRoleFromToken(user.token);
  }

  console.log("🎭 Extracted role:", role);
  console.log("✅ Allowed roles:", allowedRoles);

  // Nếu không giới hạn quyền → cho phép
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("🟢 Không giới hạn quyền → cho phép truy cập");
    return children;
  }

  // Chuẩn hóa danh sách allowed roles
  const allowed = allowedRoles.map((r) => Number(r));

  // Kiểm tra quyền hợp lệ
  if (allowed.includes(role)) {
    console.log("🟢 Role hợp lệ → cho phép truy cập");
    return children;
  }

  // Nếu không đủ quyền → chuyển về trang mặc định
  console.warn(`🚫 Role ${role} không hợp lệ → chuyển về /dashboard`);
    // Nếu bạn muốn chuyển riêng từng quyền, có thể sửa ở đây
  return <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;
