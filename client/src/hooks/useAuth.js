import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/auth.js";

/**
 *
 * stores and returns the currently logged in user or null if none exists
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
    getUser();
  }, []);

  return [user, setUser];
};
