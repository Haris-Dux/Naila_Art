import express from "express";
import { superAdminOnly, verifyUser } from "../../middleware/Auth.js";
import { getDashBoardDataForBranch } from "../../controllers/Dashboard Data/DashboardDataController.js";

const dashboardRouter = express.Router();

dashboardRouter.post(
  "/getDashBoardDataForBranch",
  verifyUser,
  getDashBoardDataForBranch
);

export default dashboardRouter;
