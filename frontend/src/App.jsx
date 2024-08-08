import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardStats from "./pages/dashboard/DashboardStats";
import SuitsStock from "./pages/inStock/suits/SuitsStock";
import Base from "./pages/inStock/base/Base";
import Lace from "./pages/inStock/lace/Lace";
import Accessories from "./pages/inStock/accessories/Accessories";
import Bag from "./pages/inStock/bag/Bag";
import PurchaseBills from "./pages/bills/PurchaseBills";
import ProcessBills from "./pages/bills/ProcessBills";
import NailaArtsBuyer from "./pages/bills/NailaArtsBuyer";
import Expense from "./pages/inStock/expense/Expense";
import Embroidery from "./pages/process/embroidery/Embroidery";
import EmbroideryDetails from "./pages/process/embroidery/EmbroideryDetails";
import Calendar from "./pages/process/calendar/Calendar";
import Cutting from "./pages/process/cutting/Cutting";
import Stitching from "./pages/process/stitching/Stitching";
import Stones from "./pages/process/stones/Stones";
import ForgetPassword from "./auth/ForgetPassword";
import ResetPassword from "./auth/ResetPassword";
import OtpChecker from "./auth/OtpChecker";
import Shop from "./pages/Shop/Shop";
import { useDispatch } from "react-redux";
import { authUserAsync } from "./features/authSlice";
import { LoginProtected, UserProtected } from "./Component/Protected/Protected";
import './App.css'
import CalendarDetails from "./pages/process/calendar/CalendarDetails";
import CuttingDetails from "./pages/process/cutting/CuttingDetails";
import StonesDetails from "./pages/process/stones/StonesDetails";
import StitchingDetails from "./pages/process/stitching/StitchingDetails";
import Buyers from "./pages/accounts/Buyers";
import Sellers from "./pages/accounts/Sellers";
import Employee from "./pages/accounts/Employee";
import BuyersDetails from "./pages/accounts/BuyersDetails";
import SellersDetails from "./pages/accounts/SellersDetails";
import EmployeeDetails from "./pages/accounts/EmployeeDetails";
import CashInOut from "./pages/cash/CashInOut";
import DailySale from "./pages/dailySale/DailySale";
import DailySaleDetail from "./pages/dailySale/DailySaleDetail";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authUserAsync());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* AUTH ROUTE */}
          <Route path="/" element={<LoginProtected> < Login />   </LoginProtected>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/otp" element={<OtpChecker />} />

          {/* DASHBOARD ROUTE */}
          <Route path="/dashboard" element={<UserProtected>  <Dashboard />  </UserProtected>}>
            <Route index element={<DashboardStats />} />
            {/* INSTOCK ROUTES */}
            <Route path="suits" element={<SuitsStock />} />
            <Route path="base" element={<Base />} />
            <Route path="lace" element={<Lace />} />
            <Route path="bag" element={<Bag />} />
            <Route path="accessories" element={<Accessories />} />
            <Route path="expense" element={<Expense />} />

            {/* BILLS ROUTES */}
            <Route path="purchasebills" element={<PurchaseBills />} />
            <Route path="processbills" element={<ProcessBills />} />
            <Route path="naila-arts-buyer" element={<NailaArtsBuyer />} />

            {/* ACCOUNTS ROUTES */}
            <Route path="buyers" element={<Buyers />} />
            <Route path="buyers-details/:id" element={<BuyersDetails />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="sellers-details/:id" element={<SellersDetails />} />
            <Route path="employee" element={<Employee />} />
            <Route path="employee-details/:id" element={<EmployeeDetails />} />

            {/* CASH IN/OUT */}
            <Route path="cash" element={<CashInOut />} />
            <Route path="dailySale" element={<DailySale />} />
            <Route path="dailySale-details/:id" element={<DailySaleDetail />} />

            {/* PROCESS ROUTES */}
            <Route path="embroidery" element={<Embroidery />} />
            <Route path="embroidery-details/:id" element={<EmbroideryDetails />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="calendar-details/:id" element={<CalendarDetails />} />
            <Route path="cutting" element={<Cutting />} />
            <Route path="cutting-details/:id" element={<CuttingDetails />} />
            <Route path="stitching" element={<Stitching />} />
            <Route path="stitching-details/:id" element={<StitchingDetails />} />
            <Route path="stones" element={<Stones />} />
            <Route path="stones-details/:id" element={<StonesDetails />} />

            {/* Shop Crud */}
            <Route path="Shop" element={<Shop />} />
          </Route >
        </Routes >
        <Toaster />
      </BrowserRouter >
    </>
  );
}

export default App;
