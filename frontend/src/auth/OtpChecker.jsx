import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpAsync } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./auth.css";

const OtpChecker = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userId } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        otp: "",
        userId: userId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        dispatch(verifyOtpAsync(formData))
            .then(() => {
                navigate('/reset')
                setFormData({
                    otp: "",
                });
            })
    };

    return (
        <>
            <section className="bg">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                    <div className="flex items-center mb-6 text-4xl font-semibold tracking-wider text-gray-100 dark:text-white">
                        NAILA ARTS
                    </div>

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                OTP Verification
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                {/* EMAIL */}
                                <div>
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        htmlFor="otp"
                                    >
                                        Enter OTP Code
                                    </label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="number"
                                        id="otp"
                                        name="otp"
                                        placeholder=""
                                        value={formData.otp}
                                        onChange={(e) =>
                                            setFormData({ ...formData, otp: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Submit
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OtpChecker;

