import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "./authSlice";
import { loginAPI } from "../../services/authService";
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await loginAPI(
        email.trim(),
        password.trim()
      );

      dispatch(loginSuccess(response));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>
          {import.meta.env.VITE_APP_NAME}
        </h1>
        <p>
          Secure role-based admin dashboard
          with session management and analytics.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <input
                type="email"
                placeholder="Email address"
                className="login-input"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
              />
            </div>

            <div className="login-input-group">
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>Demo Accounts:</p>
            <small>
              admin@mail.com / 1234 <br />
              editor@mail.com / 1234 <br />
              viewer@mail.com / 1234
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
