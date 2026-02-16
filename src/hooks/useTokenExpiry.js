import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function useTokenExpiry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accessToken } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!accessToken) return;

    try {
      const decoded = JSON.parse(
        atob(accessToken)
      );

      const currentTime = Math.floor(
        Date.now() / 1000
      );

      if (decoded.exp <= currentTime) {
        dispatch(logout());
        navigate("/");
      }

      const timeUntilExpiry =
        (decoded.exp - currentTime) * 1000;

      const timer = setTimeout(() => {
        dispatch(logout());
        navigate("/");
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Invalid token format" + error);
    }
  }, [accessToken, dispatch, navigate]);
}
