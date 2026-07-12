import { useState, useCallback, useRef } from "react";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, type });
      timerRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  return { toast, show };
}
