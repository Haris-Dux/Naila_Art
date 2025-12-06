import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loader/Loading";

const UserProtected = ({ children }) => {
  const { routingLoading, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  if ((routingLoading || user === null) && isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return children;
  }

  return <Navigate to={"/"} replace={true} />;
};

const LoginProtected = ({ children }) => {
  const { user, routingLoading, isAuthenticated } = useSelector(
    (state) => state.auth
  );


  if (routingLoading && user === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }
  if (isAuthenticated && user) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }
  return children;
};

export { UserProtected, LoginProtected };
