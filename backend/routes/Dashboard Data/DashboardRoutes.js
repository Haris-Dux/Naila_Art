import express from "express";
import { superAdminOnly, verifyOtp, verifyUser } from "../../middleware/Auth.js";
import {
  getDashBoardDataForBranch,
  getDashBoardDataForSuperAdmin,
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

export default dashboardRouter;
