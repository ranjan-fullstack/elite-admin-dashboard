import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../components/Unauthorized";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHome from "../features/dashboard/DashboardHome";
import Users from "../features/users/Users";
import Analytics from "../features/analytics/Analytics";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin","editor","viewer"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
