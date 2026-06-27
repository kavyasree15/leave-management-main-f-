import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { ROLES } from '../constants/leaveTypes';

/**
 * Custom hook for auth state and helpers
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const isEmployee = user?.role === ROLES.EMPLOYEE;
  const isManager = user?.role === ROLES.MANAGER;
  const isHR = user?.role === ROLES.HR;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isManagerOrHR = isManager || isHR;
  const isHROrAdmin = isHR || isAdmin;

  const handleLogout = () => dispatch(logout());

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isEmployee,
    isManager,
    isHR,
    isAdmin,
    isManagerOrHR,
    isHROrAdmin,
    logout: handleLogout,
  };
};

export default useAuth;
