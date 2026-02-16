import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute"

const Login = lazy(() =>
  import("./features/auth/Login.jsx")
);

const DashboardLayout = lazy(() =>
  import("./layouts/DashboardLayout.jsx")
);

const DashboardHome = lazy(() =>
  import("./features/dashboard/DashboardHome.jsx")
);

const Users = lazy(() =>
  import("./features/users/Users.jsx")
);

const Analytics = lazy(() =>
  import("./features/analytics/Analytics.jsx")
);
const Unauthorized = lazy(() =>
  import("./components/Unauthorized.jsx")
);



// 🔥 Simple Loader Component
function Loader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
        fontSize: "18px",
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<Login />} />

           {/* 🔥 Unauthorized Route */}
  <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />

            <Route
              path="users"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "editor"]}
                >
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="analytics"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                >
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
