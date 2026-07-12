import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

/**
 * Warns the user when trying to leave with unsaved changes.
 * Handles both browser close/refresh (beforeunload) and
 * in-app navigation (React Router useBlocker).
 *
 * Returns a blocker object. When `blocker.state === "blocked"`,
 * the caller should render a confirmation UI and call
 * `blocker.proceed()` or `blocker.reset()`.
 */
export function useUnsavedChanges(isDirty: boolean) {
  // Browser: refresh, close tab, navigate away
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // React Router: in-app navigation
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  return blocker;
}
