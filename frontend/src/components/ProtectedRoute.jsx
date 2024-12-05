// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');

  // 如果是 AdminPage，檢查角色
  if (children.type.name === 'AdminPage' && role !== 'admin') {
    return <Navigate to="/" />;
  }

  return isLoggedIn ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;
