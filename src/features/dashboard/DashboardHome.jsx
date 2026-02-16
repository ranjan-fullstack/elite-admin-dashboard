import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DashboardHome.css";

function DashboardHome() {
  const { users } = useSelector((state) => state.users);

  const totalUsers = users.length;
  const revenue = totalUsers * 120;
  const activeUsers = Math.floor(totalUsers * 0.7);

  const chartData = users.map((_, index) => ({
    name: `M${index + 1}`,
    users: 40 + index * 25,
  }));

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Users</h4>
          <p>{totalUsers}</p>
        </div>

        <div className="kpi-card">
          <h4>Active Users</h4>
          <p>{activeUsers}</p>
        </div>

        <div className="kpi-card">
          <h4>Revenue</h4>
          <p>${revenue}</p>
        </div>

        <div className="kpi-card">
          <h4>Growth</h4>
          <p>+12%</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <h3>User Growth</h3>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-card">
        <h3>Recent Activity</h3>
        <ul>
          <li>New user registered</li>
          <li>User updated profile</li>
          <li>Payment received</li>
          <li>System backup completed</li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardHome;
