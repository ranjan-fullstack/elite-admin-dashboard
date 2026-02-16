import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauth-wrapper">
      <div className="unauth-card">
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Denied</h2>
        <p className="error-message">
          You do not have permission to access this page.
        </p>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
