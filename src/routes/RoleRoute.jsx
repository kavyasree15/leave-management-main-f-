import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../constants/routes';

/**
 * RoleRoute — restricts access to specific roles
 */
const RoleRoute = ({ children, roles }) => {
  const { user } = useSelector(state => state.auth);

  if (!roles.includes(user?.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
};

export default RoleRoute;
