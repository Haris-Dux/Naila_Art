import express from "express";
import { superAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  approveOrRejectStock,
  assignStockToBranch,
  createBranch,
  deleteBranch,
  getAllBranches,
  getAllBranchStockHistory,
  getAllSuitsStockForBranch,
  getPendingStockForBranch,
  updateBranch,
} from "../controllers/Branch.Controller.js";

const branchRouter = express.Router();

branchRouter.post("/createBranch", superAdminOnly, createBranch);
branchRouter.post("/updateBranch", superAdminOnly, updateBranch);
branchRouter.post("/deleteBranch", superAdminOnly, deleteBranch);
branchRouter.post("/getAllBranches", verifyUser, getAllBranches);
//STOCK
branchRouter.post("/assignStockToBranch", superAdminOnly, assignStockToBranch);
branchRouter.post("/getAllBranchStockHistory", superAdminOnly, getAllBranchStockHistory);
branchRouter.post("/getAllSuitsStockForBranch", verifyUser, getAllSuitsStockForBranch);
branchRouter.post("/approveOrRejectStock", verifyUser, approveOrRejectStock);
branchRouter.post("/getPendingStockForBranch", verifyUser, getPendingStockForBranch);


export default branchRouter;
