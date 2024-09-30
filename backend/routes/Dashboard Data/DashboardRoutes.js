import express from "express";
import { superAdminOnly, verifyOtp, verifyUser } from "../../middleware/Auth.js";
import {
  getDashBoardDataForBranch,
  getDashBoardDataForSuperAdmin,
  getTransactionsHistory,
  makeTransactionInAccounts,
  sendDashBoardAccessOTP,
  verifyOtpForDasboardData,
} from "../../controllers/Dashboard Data/DashboardDataController.js";

const dashboardRouter = express.Router();

dashboardRouter.post(
  "/getDashBoardDataForBranch",
  verifyUser,
  verifyOtp,
  getDashBoardDataForBranch
);

dashboardRouter.post(
  "/getDashBoardDataForSuperAdmin",
  verifyUser,verifyOtp,
  getDashBoardDataForSuperAdmin
);

dashboardRouter.post(
  "/sendDashBoardAccessOTP",
  verifyUser,
  sendDashBoardAccessOTP
);

dashboardRouter.post(
  "/verifyOtpForDasboardData",
  verifyUser,
  verifyOtpForDasboardData
);

dashboardRouter.post(
  "/makeTransactionInAccounts",
  superAdminOnly,
  makeTransactionInAccounts
);

dashboardRouter.post(
  "/getTransactionsHistory",
  superAdminOnly,
  getTransactionsHistory
);


export default dashboardRouter;
