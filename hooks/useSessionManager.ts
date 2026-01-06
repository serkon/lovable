import { useEffect, useRef, useState, useCallback } from "react";

interface SessionManagerProps {
  onKeepAlive?: () => void;
  onStatusChange?: (status: "ONLINE" | "AWAY") => void;
  onLogoutWarning?: () => void;
  onLogout?: () => void;
  awayTimeoutMs?: number; // Default 5 mins
  warningTimeoutMs?: number; // Default 15 mins
  logoutTimeoutMs?: number; // Default 15 mins + 30s
}

export function useSessionManager({
  onKeepAlive,
  onStatusChange,
  onLogoutWarning,
  onLogout,
  awayTimeoutMs = 5 * 60 * 1000,
  warningTimeoutMs = 15 * 60 * 1000,
  logoutTimeoutMs = 15.5 * 60 * 1000,
}: SessionManagerProps) {
  const lastActivityRef = useRef<number>(Date.now());
  const [currentState, setCurrentState] = useState<"ONLINE" | "AWAY" | "WARNING">("ONLINE");
  const workerRef = useRef<Worker | null>(null);

  // Activity handler - Throttled to avoid excessive updates
  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Only process activity if enough time passed or state needs resetting
    if (now - lastActivityRef.current > 1000) {
      lastActivityRef.current = now;

      // If user was AWAY or WARNING, bring them back to ONLINE
      if (currentState !== "ONLINE") {
        setCurrentState("ONLINE");
        onStatusChange?.("ONLINE");
      }
    }
  }, [currentState, onStatusChange]);

  useEffect(() => {
    // events to detect activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

    // Throttle wrapper for event listener
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledHandler = () => {
      if (!throttleTimer) {
        handleActivity();
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
        }, 1000);
      }
    };

    events.forEach((event) => window.addEventListener(event, throttledHandler));

    // Initialize Web Worker
    workerRef.current = new Worker("/timer-worker.js");
    workerRef.current.postMessage("start");

    workerRef.current.onmessage = (e) => {
      if (e.data === "tick") {
        const now = Date.now();
        const inactiveTime = now - lastActivityRef.current;

        // 1. Check Heartbeat / Keep Alive (every 2 mins roughly, handled by parent usually, but we can trigger it)
        // Actually, the parent can handle the heartbeat interval separately or we can do it here.
        // For now, let's focus on State transitions.

        // 2. ALERT: LOGOUT THRESHOLD
        if (inactiveTime >= logoutTimeoutMs) {
          onLogout?.();
          // Reset to avoid multiple triggers
          lastActivityRef.current = now;
        }
        // 3. ALERT: WARNING THRESHOLD
        else if (inactiveTime >= warningTimeoutMs) {
          if (currentState !== "WARNING") {
            setCurrentState("WARNING");
            onLogoutWarning?.();
          }
        }
        // 4. ALERT: AWAY THRESHOLD
        else if (inactiveTime >= awayTimeoutMs) {
          if (currentState === "ONLINE") {
            setCurrentState("AWAY");
            onStatusChange?.("AWAY");
          }
        }
      }
    };

    return () => {
      events.forEach((event) => window.removeEventListener(event, throttledHandler));
      workerRef.current?.postMessage("stop");
      workerRef.current?.terminate();
    };
  }, [
    awayTimeoutMs,
    warningTimeoutMs,
    logoutTimeoutMs,
    currentState,
    handleActivity,
    onLogout,
    onLogoutWarning,
    onStatusChange,
  ]);

  return {
    resetTimer: handleActivity,
    currentState,
    getLastActivity: () => lastActivityRef.current,
  };
}
