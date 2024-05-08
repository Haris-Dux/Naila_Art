import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserProtected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);


  if (user && user.login) {
    // User is authenticated: render children
    return children;
  } else {
    // User is not authenticated: redirect to login page
    return <Navigate to="/" replace={true} />;
  }
};

const LoginProtected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);


  if (user && user.login) {
    // User is authenticated: redirect to dashboard
    return <Navigate to="/dashboard" replace={true} />;
  } else {
    // User is not authenticated: render children
    return children;
  }
};

export { UserProtected, LoginProtected };
