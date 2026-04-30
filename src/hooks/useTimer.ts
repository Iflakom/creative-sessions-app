import { useEffect, useRef } from 'react';
import { useSessionState, useSessionDispatch } from '../context/SessionContext';

export function useTimer() {
  const { timerRunning } = useSessionState();
  const dispatch = useSessionDispatch();
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!timerRunning) return;

    lastTickRef.current = Date.now();

    const id = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;
      dispatch({ type: 'TIMER_TICK', deltaMs });
    }, 100);

    return () => clearInterval(id);
  }, [timerRunning, dispatch]);
}
