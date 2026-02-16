import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT = 1 * 60 * 1000; // 5 minutes
const WARNING_TIME = 30 * 1000; // 30 seconds

export default function useSessionTimeout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);

  /* 🔥 Clear All Timers */
  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current)
      clearTimeout(warningTimerRef.current);
    if (intervalRef.current)
      clearInterval(intervalRef.current);
  };

  /* 🔥 Logout Function */
  const handleLogout = useCallback(() => {
    clearTimers();
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  /* 🔥 Start Session Timers */
  const startTimers = useCallback(() => {
    clearTimers();

    // Show warning before logout
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);

      let timeLeft = 30;
      setCountdown(timeLeft);

      intervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          handleLogout();
        }
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Final fallback logout
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  }, [handleLogout]);

  /* 🔥 Reset Session */
  const resetSession = useCallback(() => {
    setShowWarning(false);
    setCountdown(30);
    startTimers();
  }, [startTimers]);

  /* 🔥 Detect User Activity */
  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetSession)
    );

    startTimers();

    return () => {
      clearTimers();
      events.forEach((event) =>
        window.removeEventListener(
          event,
          resetSession
        )
      );
    };
  }, [resetSession, startTimers]);

  return {
    showWarning,
    countdown,
    resetSession,
  };
}
