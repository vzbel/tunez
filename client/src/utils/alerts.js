const ALERT_TIME_MS = 3000;

/**
 * Sets an alert state with the given type and message for a specified amount of time in ms.
 * The alert type can be any valid bootstrap alert type (e.g. success, warning, info, etc.)
 */
export const setTimedAlert = (
  type,
  message,
  setAlert,
  alertTimeMs = ALERT_TIME_MS,
) => {
  setAlert({
    type,
    message,
  });
  setTimeout(() => {
    setAlert(null);
  }, alertTimeMs);
};
