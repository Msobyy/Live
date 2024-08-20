import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'contexts/authContext';

const ProtectedRouteDispatcher = ({ children }) => {
  const { userData } = useContext(AuthContext);
  const isDispatcher = userData?.isDispatcher;

  // Redirect to the dashboard if the user is a dispatcher
  return isDispatcher ? <Navigate to="/dashboard/default" /> : children;
};

export default ProtectedRouteDispatcher;
