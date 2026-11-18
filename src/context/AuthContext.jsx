import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Check whether a valid login session already exists
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000);

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (response.status === 401) {
          setUser(null);
          setAuthError(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to verify authentication");
        }

        const data = await response.json();

        if (isMounted) {
          setUser(data.user);
          setAuthError(false);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Authentication check failed:", error);
        setAuthError(true);
      } finally {
        clearTimeout(timeoutId);

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Log in a user
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUser(data.user);
    setAuthError(false);
    return data;
  };

  // Log out the current user
  const logout = async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    setUser(null);
    setAuthError(false);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
