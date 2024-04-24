import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Implement your authentication logic here
  const isAuthenticated = !!localStorage.getItem("authToken"); // Replace with your actual authentication check

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

export default PublicRoute;
