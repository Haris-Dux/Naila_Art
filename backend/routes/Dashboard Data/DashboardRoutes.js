import express from "express";
import { superAdminOnly, verifyUser } from "../../middleware/Auth.js";
import {
  getDashBoardDataForBranch,
  getDashBoardDataForSuperAdmin,
} from "../../controllers/Dashboard Data/DashboardDataController.js";

const dashboardRouter = express.Router();

dashboardRouter.post(
  "/getDashBoardDataForBranch",
  verifyUser,
  getDashBoardDataForBranch
);

dashboardRouter.post(
  "/getDashBoardDataForSuperAdmin",
  superAdminOnly,
  getDashBoardDataForSuperAdmin
);

export default dashboardRouter;
