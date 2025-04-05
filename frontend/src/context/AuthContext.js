
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === "admin" && password === "password123") {
      const userData = { username, role: "admin" };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Helper function to check if the current user is an admin
  const isAdmin = user?.role === "admin";

  // Make currentUser more explicit for consistency with the AdminLayout component
  const currentUser = user;

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      user, 
      login, 
      logout, 
      isAdmin,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};