import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { logout } from "../features/auth/authSlice";
import { canViewAnalytics } from "../utils/permissions";
import useSessionTimeout from "../hooks/useSessionTimeout";
import useTokenExpiry from "../hooks/useTokenExpiry";

import "./DashboardLayout.css";

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );
  const role = user?.role;

  /* 🔥 Session Hook */
  const {
    showWarning,
    countdown,
    resetSession,
  } = useSessionTimeout();

     useTokenExpiry();
  /* 🔥 Manual Logout */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">

      {/* 🔥 Sidebar */}
      <aside className="sidebar">
        <h2>Elite Admin</h2>

        <nav>
          <NavLink
            to="/dashboard"
            end
            className="nav-item"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/users"
            className="nav-item"
          >
            Users
          </NavLink>

          {canViewAnalytics(role) && (
            <NavLink
              to="/dashboard/analytics"
              className="nav-item"
            >
              Analytics
            </NavLink>
          )}
        </nav>
      </aside>

      {/* 🔥 Main Section */}
      <div className="main-section">

        {/* 🔥 Topbar */}
        <header className="topbar">
          <div className="user-info">
            Welcome, {user?.email} ({role})
          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </header>

        {/* 🔥 Page Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* 🔥 Session Warning Modal */}
      {showWarning && (
        <div className="session-modal">
          <div className="session-card">
            <h3>Session Expiring Soon</h3>
            <p>
              You will be logged out in{" "}
              <strong>{countdown}</strong> seconds.
            </p>

            <button
              onClick={resetSession}
              className="stay-btn"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
