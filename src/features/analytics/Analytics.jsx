import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useMemo } from "react";
import "./Analytics.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

function Analytics() {
  const { users } = useSelector((state) => state.users);
  const [range, setRange] = useState("6m");

  const totalUsers = users.length;
  const activeUsers = Math.floor(totalUsers * 0.7);
  const revenue = totalUsers * 120;

  /* 🔥 24 Months Data (For Comparison) */
  const baseData = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      month: `M${index + 1}`,
      users: 40 + index * 15,
      revenue: 800 + index * 300,
    }));
  }, []);

  /* 🔥 Current vs Previous Period Logic */
  const { currentData, previousData } = useMemo(() => {
    let months = 12;
    if (range === "3m") months = 3;
    if (range === "6m") months = 6;

    const current = baseData.slice(-months);
    const previous = baseData.slice(-months * 2, -months);

    return {
      currentData: current,
      previousData: previous,
    };
  }, [range, baseData]);

  /* 🔥 Role Distribution */
  const roleData = [
    { name: "Admin", value: 2 },
    { name: "Editor", value: 4 },
    { name: "User", value: totalUsers - 6 > 0 ? totalUsers - 6 : 2 },
  ];

  /* ---------------- EXPORT FUNCTIONS ---------------- */

  const exportToCSV = () => {
    if (!users.length) return;

    const headers = ["ID", "Name", "Email"];
    const rows = users.map((u) => [u.id, u.name, u.email]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "users-report.csv";
    link.click();
  };

  const exportToExcel = () => {
    if (!users.length) return;

    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users-report.xlsx");
  };

  const exportToPDF = () => {
    if (!users.length) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Users Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Total Users: ${totalUsers}`, 14, 25);
    doc.text(`Active Users: ${activeUsers}`, 14, 32);
    doc.text(`Revenue: $${revenue}`, 14, 39);

    autoTable(doc, {
      startY: 50,
      head: [["ID", "Name", "Email"]],
      body: users.map((u) => [u.id, u.name, u.email]),
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save("users-report.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  /* --------------------------------------------------- */

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Advanced Analytics</h2>

      <div className="filter-section">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="analytics-select"
        >
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>

        <button onClick={exportToCSV} className="export-btn">
          CSV
        </button>

        <button onClick={exportToExcel} className="export-btn">
          Excel
        </button>

        <button onClick={exportToPDF} className="export-btn">
          PDF
        </button>

        <button onClick={handlePrint} className="export-btn print-btn">
          Print
        </button>
      </div>

      <div className="analytics-kpi">
        <div className="analytics-card">Total Users: {totalUsers}</div>
        <div className="analytics-card">Active Users: {activeUsers}</div>
        <div className="analytics-card">Revenue: ${revenue}</div>
      </div>

      {/* 🔥 Comparison Line Chart */}
      <div className="analytics-card chart-card">
        <h3>User Growth Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />

            <Line
              data={currentData}
              type="monotone"
              dataKey="users"
              name="Current Period"
              stroke="#6366f1"
              strokeWidth={3}
              animationDuration={1500}
            />

            <Line
              data={previousData}
              type="monotone"
              dataKey="users"
              name="Previous Period"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 Revenue Bar Chart */}
      <div className="analytics-card chart-card">
        <h3>Revenue Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#22c55e"
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 Role Distribution */}
      <div className="analytics-card chart-card">
        <h3>User Role Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={roleData} dataKey="value" outerRadius={100} label>
              {roleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
