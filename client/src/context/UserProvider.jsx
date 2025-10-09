import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create a context to share user authentication state across the app
export const UserContext = createContext();

export function UserProvider({ children }) {
  // State to hold the currently logged-in user
  const [user, setUser] = useState(null);

  // State to indicate whether user initialization (from localStorage) is done
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect runs once on component mount to initialize user from token
  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      console.log("🔄 UserProvider - Initializing with token:", !!token);

      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode JWT token
          console.log(" UserProvider - Decoded token:", decoded);

          // Map decoded token to user object
          const userData = {
            user_id: decoded.userid, // User ID from token
            user_name: decoded.username, // Username from token
            token: token, // Keep token for API requests
          };

          console.log(" UserProvider - Setting user:", userData);
          setUser(userData); // Set user state
        } catch (error) {
          // If token is invalid or cannot be decoded, remove it
          console.error("❌ UserProvider - Token decode error:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        console.log("❌ UserProvider - No token available");
        setUser(null); // No token means no user
      }
      setIsInitialized(true); // Mark initialization as complete
    };

    initializeUser();
  }, []);

  // Function to update the user state safely from anywhere
  const setUserStable = (newUser) => {
    console.log("🔄 UserProvider - Setting new user:", newUser);
    if (newUser === null) {
      setUser(null); // Log out user
      return;
    }

    // Map incoming user data to consistent user object
    setUser({
      user_id: newUser.user_id || newUser.userid,
      user_name: newUser.user_name || newUser.username,
      token: newUser.token,
    });
  };

  // Debug logs to track current state
  console.log("🔍 UserProvider - Current user state:", user);
  console.log("🔍 UserProvider - Is initialized:", isInitialized);

  // Provide the user state and setter to child components
  return (
    <UserContext.Provider value={[user, setUserStable]}>
      {/* Show children only after initialization is done */}
      {isInitialized ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
}
