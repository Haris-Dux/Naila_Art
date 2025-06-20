import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginuserAsync } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./auth.css";
import { getAllPaymentMetodsForTransactionAsync } from "../features/PaymentMethodsSlice";
import { GetAllBranches } from "../features/InStockSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "dev.offical@nailaarts.com",
    password: "Bilal_Haseeb@786",
  });

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginuserAsync(formData)).then((res) => {
      if (res?.payload?.login) {
        dispatch(getAllPaymentMetodsForTransactionAsync())
        dispatch(GetAllBranches())
        navigate("/dashboard");
        setFormData({
          email: "",
          password: "",
        });
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section className="bg flex items-center justify-center">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center py-3 rounded-tl-lg sm:max-w-md rounded-bl-lg  justify-center text-gray-900 bg-white">
          <h1 className="text-4xl font-semibold">NAILA ARTS</h1>
          <img
            src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/Untitled_design_2.png?v=1723727238"
            alt="Retail Management System"
            className="w-3/4 max-w-xs rounded-lg"
          />
          <p className="text-md uppercase font-bold text-center mb-1 mx-4">
            The ultimate retail management system
          </p>
          <p className="text-sm text-gray-400">
            © 2025 NAILA ARTS. All rights reserved.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-center justify-center py-6 min-h-screen ">
          <div className="w-full bg-white rounded-tr-lg rounded-br-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* EMAIL */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="email"
                  >
                    Your email
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* TOGGLE PASSWORD VISIBILITY */}
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        aria-describedby="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                        id="remember"
                        type="checkbox"
                        onChange={togglePasswordVisibility}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        className="text-gray-500 dark:text-gray-300 select-none cursor-pointer"
                        htmlFor="remember"
                      >
                        show password
                      </label>
                    </div>
                  </div>
                  <Link
                    to="/forget"
                    className="text-sm font-medium text-gray-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {loading ? (
                  <button
                    disabled
                    type="button"
                    className="w-full text-white cursor-not-allowed bg-gray-800 hover:bg-gray-600  focus:outline-none focus:ring-gray-400 font-medium rounded-md text-sm px-5 h-10 text-center "
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-gray-800 hover:bg-gray-600  focus:outline-none focus:ring-gray-400 font-medium rounded-md text-sm px-5 h-10 text-center "
                  >
                    Sign in
                  </button>
                )}

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-gray-800 hover:underline "
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
