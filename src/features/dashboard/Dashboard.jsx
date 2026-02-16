import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/authSlice";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2>Elite Admin</h2>
        <ul>
          <li>Dashboard</li>
          <li>Users</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h3>Dashboard Overview</h3>
            <p className="welcome-text">
              Welcome, {user?.email}
            </p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="cards">
          <div className="card">Total Users: 120</div>
          <div className="card">Revenue: $45,000</div>
          <div className="card">Active Sessions: 32</div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
