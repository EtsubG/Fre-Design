import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
