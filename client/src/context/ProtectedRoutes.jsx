import React, { useContext } from "react";
import { UserContext } from "./UserProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user] = useContext(UserContext);
  
  // Simple check - if no user, redirect to login
  if (!user) {
    return <Navigate to="/users/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;