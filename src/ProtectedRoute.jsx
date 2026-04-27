import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, isTokenValid, getUserFromToken } from './utils/auth';

function resolveRoleFromToken() {
  const token = getToken();
  if (!token) return null;
  if (!isTokenValid(token)) return null;
  const payload = getUserFromToken(token);
  if (!payload) return null;
  if (payload.role) return payload.role;
  if (payload.roles && Array.isArray(payload.roles) && payload.roles.length) return payload.roles[0];
  // fallback to username-based role claim names
  return null;
}

function ProtectedRoute({ allowedRoles, userRole, redirectTo = '/', children }) {
  let roleToCheck = userRole || resolveRoleFromToken();

  if (!roleToCheck) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(roleToCheck)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
