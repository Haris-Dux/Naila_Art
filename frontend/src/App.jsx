import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authUserAsync, logoutUserAsync } from "./features/authSlice";
import { LoginProtected, UserProtected } from "./Component/Protected/Protected";
import axios from "axios";
import './App.css';


import Login from "./auth/Login";
import ForgetPassword from "./auth/ForgetPassword";
import ResetPassword from "./auth/ResetPassword";
import OtpChecker from "./auth/OtpChecker";
import Loading from "./Component/Loader/Loading";

// ===== Lazy Imports =====
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DashboardStats = lazy(() => import("./pages/dashboard/DashboardStats"));
const SuitsStock = lazy(() => import("./pages/inStock/suits/SuitsStock"));
const Base = lazy(() => import("./pages/inStock/base/Base"));
const Lace = lazy(() => import("./pages/inStock/lace/Lace"));
const Accessories = lazy(() => import("./pages/inStock/accessories/Accessories"));
const Bag = lazy(() => import("./pages/inStock/bag/Bag"));
const Expense = lazy(() => import("./pages/inStock/expense/Expense"));
const ExpenseStats = lazy(() => import("./pages/inStock/expense/ExpenseStats"));
const AssignStock = lazy(() => import("./pages/inStock/assignstocks/AssignStock"));
const AssignedStockHistory = lazy(() => import("./pages/inStock/assignstocks/AssignedStockHistory"));
const PurchaseBills = lazy(() => import("./pages/bills/PurchaseBills"));
const ProcessBills = lazy(() => import("./pages/bills/ProcessBills"));
const ProcessDetails = lazy(() => import("./pages/bills/ProcessDetails"));
const NailaArtsBuyer = lazy(() => import("./pages/bills/NailaArtsBuyer"));
const OtherSaleBills = lazy(() => import("./pages/bills/OtherSaleBills"));
const ReturnBills = lazy(() => import("./pages/bills/ReturnBills"));
const GenerateBill = lazy(() => import("./pages/generateBills/GenerateBill"));
const OldBuyerGenerateBill = lazy(() => import("./pages/generateBills/OldBuyerGenerateBill"));
const Buyers = lazy(() => import("./pages/accounts/Buyers"));
const BuyersDetails = lazy(() => import("./pages/accounts/BuyersDetails"));
const BuyersChecks = lazy(() => import("./pages/checks/BuyerChecks"));
const Sellers = lazy(() => import("./pages/accounts/Sellers"));
const SellersDetails = lazy(() => import("./pages/accounts/SellersDetails"));
const Employee = lazy(() => import("./pages/accounts/Employee"));
const EmployeeDetails = lazy(() => import("./pages/accounts/EmployeeDetails"));
const OtherAccounts = lazy(() => import("./pages/accounts/OtherAccounts/OtherAccounts"));
const OtherAccountsDetails = lazy(() => import("./pages/accounts/OtherAccounts/OtherAccountDetails"));
const CashInOut = lazy(() => import("./pages/cash/CashInOut"));
const CashBook = lazy(() => import("./pages/cashBook/CashBook"));
const DailySale = lazy(() => import("./pages/dailySale/DailySale"));
const DailySaleDetail = lazy(() => import("./pages/dailySale/DailySaleDetail"));
const Embroidery = lazy(() => import("./pages/process/embroidery/Embroidery"));
const EmbroideryDetails = lazy(() => import("./pages/process/embroidery/EmbroideryDetails"));
const UpdateEmbroidery = lazy(() => import("./pages/process/embroidery/UpdateEmbroidery"));
const Calendar = lazy(() => import("./pages/process/calendar/Calendar"));
const CalendarDetails = lazy(() => import("./pages/process/calendar/CalendarDetails"));
const Cutting = lazy(() => import("./pages/process/cutting/Cutting"));
const CuttingDetails = lazy(() => import("./pages/process/cutting/CuttingDetails"));
const Stitching = lazy(() => import("./pages/process/stitching/Stitching"));
const StitchingDetails = lazy(() => import("./pages/process/stitching/StitchingDetails"));
const Stones = lazy(() => import("./pages/process/stones/Stones"));
const StonesDetails = lazy(() => import("./pages/process/stones/StonesDetails"));
const PackingDetails = lazy(() => import("./pages/process/Packing/PackingDetails"));
const B_Pair = lazy(() => import("./pages/process/b_pair/B_Pair"));
const VerifyOTP = lazy(() => import("./pages/dashboard/VerifyOTP"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const PendingRequest = lazy(() => import("./pages/Shop/PendingRequest"));
const PaymentMethods = lazy(() => import("./pages/paymentMethods/PaymentMethods"));

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.defaults.timeout = 5 * 60 * 1000;
    axios.defaults.withCredentials = true;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          dispatch(logoutUserAsync()).then((res) => {
            if (res.payload?.success) {
              navigate("/");
            }
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate]);

  
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(authUserAsync()).then((res) => {
        if (res.payload === undefined) {
          navigate("/");
          dispatch(logoutUserAsync());
        }
      });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">
        <Loading />
      </div>}>
        <Routes>
          {/* AUTH ROUTE */}
          <Route path="/" element={<LoginProtected><Login /></LoginProtected>} />
          <Route path="/forget" element={<LoginProtected><ForgetPassword /></LoginProtected>} />
          <Route path="/reset" element={<LoginProtected><ResetPassword /></LoginProtected>} />
          <Route path="/otp" element={<LoginProtected><OtpChecker /></LoginProtected>} />

          {/* DASHBOARD ROUTE */}
          <Route path="/dashboard" element={<UserProtected><Dashboard /></UserProtected>}>
            <Route index element={<DashboardStats />} />
            <Route path="suits" element={<SuitsStock />} />
            <Route path="base" element={<Base />} />
            <Route path="lace" element={<Lace />} />
            <Route path="bag" element={<Bag />} />
            <Route path="accessories" element={<Accessories />} />
            <Route path="expense" element={<Expense />} />
            <Route path="expense-stats" element={<ExpenseStats />} />
            <Route path="assignstocks" element={<AssignStock />} />
            <Route path="AssignedStockHistory" element={<AssignedStockHistory />} />
            <Route path="generate-bill" element={<GenerateBill />} />
            <Route path="old-buyer-generate-bill/:id" element={<OldBuyerGenerateBill />} />
            <Route path="purchasebills" element={<PurchaseBills />} />
            <Route path="processbills" element={<ProcessBills />} />
            <Route path="process-details/:id/:category" element={<ProcessDetails />} />
            <Route path="naila-arts-buyer" element={<NailaArtsBuyer />} />
            <Route path="other-sale" element={<OtherSaleBills />} />
            <Route path="naila-arts-return-bills" element={<ReturnBills />} />
            <Route path="buyers" element={<Buyers />} />
            <Route path="buyers-checks/:id" element={<BuyersChecks />} />
            <Route path="buyers-details/:id" element={<BuyersDetails />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="sellers-details/:id" element={<SellersDetails />} />
            <Route path="employee" element={<Employee />} />
            <Route path="employee-details/:id" element={<EmployeeDetails />} />
            <Route path="other-accounts" element={<OtherAccounts />} />
            <Route path="other-accounts/:id" element={<OtherAccountsDetails />} />
            <Route path="cash" element={<CashInOut />} />
            <Route path="dailySale" element={<DailySale />} />
            <Route path="dailySale-details/:id" element={<DailySaleDetail />} />
            <Route path="embroidery" element={<Embroidery />} />
            <Route path="embroidery-details/:id" element={<EmbroideryDetails />} />
            <Route path="embroidery-update/:id" element={<UpdateEmbroidery />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="calendar-details/:id" element={<CalendarDetails />} />
            <Route path="cutting" element={<Cutting />} />
            <Route path="cutting-details/:id" element={<CuttingDetails />} />
            <Route path="stitching" element={<Stitching />} />
            <Route path="stitching-details/:id" element={<StitchingDetails />} />
            <Route path="stones" element={<Stones />} />
            <Route path="stones-details/:id" element={<StonesDetails />} />
            <Route path="packing-details/:id" element={<PackingDetails />} />
            <Route path="bpair" element={<B_Pair />} />
            <Route path="cash-book" element={<CashBook />} />
            <Route path="verifyOtp" element={<VerifyOTP />} />
            <Route path="Shop" element={<Shop />} />
            <Route path="PendingRequest" element={<PendingRequest />} />
            <Route path="paymentMethods" element={<PaymentMethods />} />
          </Route>

          {/* WILD CARD */}
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
