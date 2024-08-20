import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserProtected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-8xl">
        Loading...
      </div>
    ); 
  }

  if (user && user.login) {
    return children; 
  } else {
    const lastPath = localStorage.getItem("lastPath");
    return <Navigate to={lastPath || "/"} replace={true} />;
  }
};

const LoginProtected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-8xl">
        Loading...
      </div>
    );
  }

  if (user && user.login) {
    const lastPath = localStorage.getItem("lastPath");
    return <Navigate to={lastPath || "/dashboard"} replace={true} />;
  } else {
    return children;
  }
};

export { UserProtected, LoginProtected };
