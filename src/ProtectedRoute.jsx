import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ allowedRoles, userRole, redirectTo = '/', children }) {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
