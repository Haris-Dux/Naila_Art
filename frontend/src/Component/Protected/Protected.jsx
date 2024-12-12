import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserProtected = ({ children }) => {
  const { user, routingLoading } = useSelector((state) => state.auth);
  const lastPath = localStorage.getItem("lastPath");

  useEffect(() => {
    if (user && user.login && lastPath) {
      localStorage.removeItem("lastPath");
    }
  }, [user, lastPath]);

  if (routingLoading) {
    return <div></div>;
  }

  if (user && user.login) {
    return children;
  } else {
    return <Navigate to={lastPath} replace={true} />;
  }
};

const LoginProtected = ({ children }) => {
  const { user, routingLoading } = useSelector((state) => state.auth);
  const lastPath = localStorage.getItem("lastPath");

  useEffect(() => {
    if (user && user.login && lastPath) {
      localStorage.removeItem("lastPath");
    }
  }, [user, lastPath]);

  if (routingLoading) {
    return <div></div>;
  }

  if (user && user.login) {
    return <Navigate to={lastPath || "/dashboard"} replace={true} />;
  } else {
    return children;
  }
};

export { UserProtected, LoginProtected };
