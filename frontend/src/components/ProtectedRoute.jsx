// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');
  const admin = localStorage.getItem('admin');

  return isLoggedIn ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;
